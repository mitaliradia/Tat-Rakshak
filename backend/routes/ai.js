const express = require('express');
const auth = require('../middleware/auth');
const aiService = require('../services/aiService');
const router = express.Router();

// Get AI analysis for a specific location
router.get('/analyze/:location', auth, async (req, res) => {
    try {
        const { location } = req.params;
        
        // Validate location
        const validLocations = ['Pulicat Lake', 'Sunderbans', 'Goa Coast', 'Kochi'];
        if (!validLocations.includes(location)) {
            return res.status(400).json({ 
                message: 'Invalid location. Must be one of: ' + validLocations.join(', ') 
            });
        }

        console.log(`Running AI analysis for ${location}...`);
        const result = await aiService.runAnalysis(location);
        
        if (result.success) {
            res.json({
                success: true,
                location: location,
                data: result.data,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'AI analysis failed',
                error: result.error
            });
        }
    } catch (error) {
        console.error('AI analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during AI analysis',
            error: error.message
        });
    }
});

// Get AI analysis for all locations
router.get('/analyze-all', auth, async (req, res) => {
    try {
        console.log('Running AI analysis for all locations...');
        const result = await aiService.runAllAnalysis();
        
        if (result.success) {
            res.json({
                success: true,
                data: result.data,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'AI analysis failed',
                error: result.error
            });
        }
    } catch (error) {
        console.error('AI analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during AI analysis',
            error: error.message
        });
    }
});

// Get latest AI analysis results from database
router.get('/latest-results', auth, async (req, res) => {
    try {
        const db = require('mongoose').connection.db;
        const collection = db.collection('ai_analysis');
        
        // Get the latest analysis for each location
        const pipeline = [
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: '$location',
                    latestAnalysis: { $first: '$$ROOT' }
                }
            },
            {
                $replaceRoot: { newRoot: '$latestAnalysis' }
            }
        ];
        
        const results = await collection.aggregate(pipeline).toArray();
        
        res.json({
            success: true,
            data: results,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch latest results',
            error: error.message
        });
    }
});

// Get AI analysis by location and date range
router.get('/location/:location/history', auth, async (req, res) => {
    try {
        const { location } = req.params;
        const { startDate, endDate, limit = 10 } = req.query;
        
        const db = require('mongoose').connection.db;
        const collection = db.collection('ai_analysis');
        
        let query = { location: location };
        
        // Add date range filter if provided
        if (startDate && endDate) {
            query.timestamp = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const results = await collection
            .find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .toArray();
        
        res.json({
            success: true,
            location: location,
            data: results,
            count: results.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch historical data',
            error: error.message
        });
    }
});

// Check AI service health
router.get('/health', auth, async (req, res) => {
    try {
        const isHealthy = await aiService.checkServiceHealth();
        
        res.json({
            success: true,
            service: 'AI Analysis Service',
            status: isHealthy ? 'healthy' : 'unhealthy',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.json({
            success: false,
            service: 'AI Analysis Service',
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;