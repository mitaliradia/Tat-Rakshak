const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const { auth } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const router = express.Router();

// MongoDB connection for analysis results
const analysisSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Analysis = mongoose.model('Analysis', analysisSchema, 'ai_analysis');

// Map configuration schema
const mapConfigSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const MapConfig = mongoose.model('MapConfig', mapConfigSchema, 'map_configurations');

// @desc    Run Python GEE analysis
// @route   POST /api/gee/analyze
// @access  Private (Authority only)
const runGeeAnalysis = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { locations } = req.body;
    
    // Validate locations
    const validLocations = ['Sunderbans', 'Pulicat Lake', 'Goa Coast', 'Kochi'];
    const requestedLocations = locations || validLocations;
    
    const invalidLocations = requestedLocations.filter(loc => !validLocations.includes(loc));
    if (invalidLocations.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid locations: ${invalidLocations.join(', ')}`
      });
    }

    // Path to Python script
    const pythonScriptPath = path.join(__dirname, '../../coastal-monitoring-backend/coastal_ai_analyst_fixed_1.py');
    
    console.log('Starting Python GEE analysis...');
    
    // Run Python script as child process
    const pythonProcess = spawn('python', [pythonScriptPath], {
      env: {
        ...process.env,
        MONGODB_URI: process.env.MONGODB_URI,
        GROQ_API_KEY: process.env.GROQ_API_KEY
      },
      cwd: path.dirname(pythonScriptPath)
    });

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Python output:', output);
      outputData += output;
    });

    pythonProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.error('Python error:', error);
      errorData += error;
    });

    pythonProcess.on('close', async (code) => {
      clearTimeout(timeout); // Clear timeout first
      
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        console.error('Python stderr:', errorData);
        return res.status(500).json({
          success: false,
          message: 'Python analysis failed',
          error: errorData,
          output: outputData
        });
      }

      try {
        console.log('Python process completed successfully, fetching results from MongoDB...');
        
        // Wait a moment for any final DB writes to complete
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Fetch the latest analysis results from MongoDB for each location
        const latestAnalysis = [];
        for (const location of requestedLocations) {
          const locationAnalysis = await Analysis.findOne({
            location: location
          }).sort({ createdAt: -1 });
          if (locationAnalysis) {
            latestAnalysis.push(locationAnalysis);
          }
        }

        // Fetch the latest map configurations for each location
        const mapConfigs = [];
        for (const location of requestedLocations) {
          const locationMapConfig = await MapConfig.findOne({
            location: location
          }).sort({ createdAt: -1 });
          if (locationMapConfig) {
            mapConfigs.push(locationMapConfig);
          }
        }

        console.log(`Found ${latestAnalysis.length} analysis results for locations:`, requestedLocations);
        console.log(`Found ${mapConfigs.length} map configurations`);

        res.json({
          success: true,
          message: 'GEE analysis completed successfully',
          data: {
            analysis_results: latestAnalysis,
            map_configurations: mapConfigs,
            processed_locations: requestedLocations,
            total_analyses: latestAnalysis.length,
            python_output: outputData
          }
        });

      } catch (dbError) {
        console.error('Database error after Python execution:', dbError);
        res.status(500).json({
          success: false,
          message: 'Python analysis completed but failed to retrieve results from database',
          error: dbError.message
        });
      }
    });

    pythonProcess.on('error', (error) => {
      clearTimeout(timeout);
      console.error('Failed to start Python process:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start Python analysis',
        error: error.message
      });
    });

    // Set timeout for long-running process (5 minutes)
    const timeout = setTimeout(() => {
      pythonProcess.kill('SIGTERM');
      res.status(408).json({
        success: false,
        message: 'Python analysis timed out (5 minutes limit)',
        partial_output: outputData
      });
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error('GEE analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during GEE analysis',
      error: error.message
    });
  }
};

// @desc    Get latest analysis results
// @route   GET /api/gee/results
// @access  Private
const getAnalysisResults = async (req, res) => {
  try {
    const { location, limit = 10 } = req.query;
    
    const query = location ? { location } : {};
    
    const results = await Analysis.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const mapConfigs = await MapConfig.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        analysis_results: results,
        map_configurations: mapConfigs,
        total_results: results.length
      }
    });

  } catch (error) {
    console.error('Get analysis results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis results',
      error: error.message
    });
  }
};

// @desc    Get analysis status
// @route   GET /api/gee/status
// @access  Private
const getAnalysisStatus = async (req, res) => {
  try {
    const latestAnalyses = await Analysis.aggregate([
      {
        $group: {
          _id: '$location',
          latest_analysis: { $last: '$$ROOT' },
          count: { $sum: 1 }
        }
      }
    ]);

    const status = {
      locations_analyzed: latestAnalyses.length,
      total_analyses: latestAnalyses.reduce((sum, item) => sum + item.count, 0),
      last_updated: latestAnalyses.length > 0 ? 
        Math.max(...latestAnalyses.map(item => new Date(item.latest_analysis.createdAt))) : null,
      locations: latestAnalyses.map(item => ({
        location: item._id,
        threat_level: item.latest_analysis.threat_level,
        last_analysis: item.latest_analysis.createdAt,
        anomaly_count: item.latest_analysis.anomaly_count || 0
      }))
    };

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Get analysis status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analysis status',
      error: error.message
    });
  }
};

// Validation middleware for analysis request
const validateAnalysisRequest = [
  body('locations')
    .optional()
    .isArray()
    .withMessage('Locations must be an array'),
  body('locations.*')
    .optional()
    .isIn(['Sunderbans', 'Pulicat Lake', 'Goa Coast', 'Kochi'])
    .withMessage('Invalid location specified')
];

// Routes
router.post('/analyze', validateAnalysisRequest, runGeeAnalysis); // Temporarily removing auth for testing
router.get('/results', getAnalysisResults); // Temporarily removing auth for testing
router.get('/status', getAnalysisStatus); // Temporarily removing auth for testing

module.exports = router;
