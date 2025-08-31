const AlgaeData = require('../models/AlgaeData');
const { validationResult } = require('express-validator');

// @desc    Get all algae data
// @route   GET /api/algae
// @access  Private (Authority only)
const getAlgaeData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { region, intensity } = req.query;
    
    // Build filter object
    const filter = {};
    if (region) filter.region = { $regex: region, $options: 'i' };
    if (intensity) filter.intensity = { $gte: parseInt(intensity) };

    const algaeData = await AlgaeData.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AlgaeData.countDocuments(filter);

    res.json({
      success: true,
      data: algaeData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get algae data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching algae data'
    });
  }
};

// @desc    Get latest algae analysis
// @route   GET /api/algae/latest
// @access  Private (Authority only)
const getLatestAlgaeAnalysis = async (req, res) => {
  try {
    const latestData = await AlgaeData.findOne()
      .sort({ createdAt: -1 });

    if (!latestData) {
      // Return default data if no data exists
      return res.json({
        success: true,
        data: {
          analysis: "Algae bloom activity is concentrated in the northern region, with a significant increase over the past week. Environmental factors such as temperature and nutrient levels are contributing to the spread. Immediate monitoring and mitigation are recommended.",
          heatmapData: [],
          graphs: [
            {
              type: "line",
              title: "Algae Intensity Over Time",
              url: "/images/algae-graph1.png",
              data: []
            },
            {
              type: "bar",
              title: "Regional Distribution",
              url: "/images/algae-graph2.png",
              data: []
            }
          ],
          region: "Northern Region",
          intensity: 75,
          temperature: 28.5,
          nutrientLevel: 45.2
        }
      });
    }

    res.json({
      success: true,
      data: latestData
    });
  } catch (error) {
    console.error('Get latest algae analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching latest algae analysis'
    });
  }
};

// @desc    Get algae heatmap data
// @route   GET /api/algae/heatmap
// @access  Private (Authority only)
const getAlgaeHeatmap = async (req, res) => {
  try {
    const heatmapData = await AlgaeData.find({}, 'region coordinates intensity heatmapData createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    // Flatten heatmap data from all records
    const combinedHeatmapData = [];
    heatmapData.forEach(data => {
      if (data.heatmapData && data.heatmapData.length > 0) {
        combinedHeatmapData.push(...data.heatmapData);
      } else {
        // Add main coordinates as heatmap point
        combinedHeatmapData.push({
          lat: data.coordinates.latitude,
          lng: data.coordinates.longitude,
          intensity: data.intensity
        });
      }
    });

    res.json({
      success: true,
      data: combinedHeatmapData
    });
  } catch (error) {
    console.error('Get algae heatmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching algae heatmap data'
    });
  }
};

// @desc    Create algae data entry
// @route   POST /api/algae
// @access  Private (Authority only)
const createAlgaeData = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const algaeData = new AlgaeData(req.body);
    await algaeData.save();

    res.status(201).json({
      success: true,
      message: 'Algae data created successfully',
      data: algaeData
    });
  } catch (error) {
    console.error('Create algae data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating algae data'
    });
  }
};

// @desc    Update algae data
// @route   PUT /api/algae/:id
// @access  Private (Authority only)
const updateAlgaeData = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const algaeData = await AlgaeData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!algaeData) {
      return res.status(404).json({
        success: false,
        message: 'Algae data not found'
      });
    }

    res.json({
      success: true,
      message: 'Algae data updated successfully',
      data: algaeData
    });
  } catch (error) {
    console.error('Update algae data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating algae data'
    });
  }
};

module.exports = {
  getAlgaeData,
  getLatestAlgaeAnalysis,
  getAlgaeHeatmap,
  createAlgaeData,
  updateAlgaeData
};
