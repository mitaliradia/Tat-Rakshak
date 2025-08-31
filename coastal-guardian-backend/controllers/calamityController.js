const CalamityData = require('../models/CalamityData');
const { validationResult } = require('express-validator');

// @desc    Get all calamity data
// @route   GET /api/calamity
// @access  Private (Authority only)
const getCalamityData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { region, type, riskLevel, status } = req.query;
    
    // Build filter object
    const filter = {};
    if (region) filter.region = { $regex: region, $options: 'i' };
    if (type) filter.type = type;
    if (riskLevel) filter.riskLevel = riskLevel;
    if (status) filter.status = status;

    const calamityData = await CalamityData.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CalamityData.countDocuments(filter);

    res.json({
      success: true,
      data: calamityData,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get calamity data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching calamity data'
    });
  }
};

// @desc    Get latest calamity analysis
// @route   GET /api/calamity/latest
// @access  Private (Authority only)
const getLatestCalamityAnalysis = async (req, res) => {
  try {
    const latestData = await CalamityData.findOne()
      .sort({ createdAt: -1 });

    if (!latestData) {
      // Return default data if no data exists
      return res.json({
        success: true,
        data: {
          analysis: "Current weather patterns indicate moderate risk levels across coastal regions. Wind speeds are within normal ranges, but tide levels are elevated. Continue monitoring for any significant changes in weather conditions.",
          heatmapData: [],
          graphs: [
            {
              type: "line",
              title: "Risk Level Trends",
              url: "/images/calamity-graph1.png",
              data: []
            },
            {
              type: "bar",
              title: "Regional Risk Distribution",
              url: "/images/calamity-graph2.png",
              data: []
            }
          ],
          region: "Multi-Regional",
          type: "Storm Surge",
          riskLevel: "Medium",
          prediction: {
            probability: 35,
            timeframe: "Next 48 hours",
            impact: "Moderate",
            recommendedActions: [
              {
                action: "Monitor tide levels closely",
                priority: "High"
              },
              {
                action: "Issue coastal advisory",
                priority: "Medium"
              }
            ]
          }
        }
      });
    }

    res.json({
      success: true,
      data: latestData
    });
  } catch (error) {
    console.error('Get latest calamity analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching latest calamity analysis'
    });
  }
};

// @desc    Get calamity heatmap data
// @route   GET /api/calamity/heatmap
// @access  Private (Authority only)
const getCalamityHeatmap = async (req, res) => {
  try {
    const heatmapData = await CalamityData.find({}, 'region coordinates riskLevel type heatmapData createdAt')
      .sort({ createdAt: -1 })
      .limit(100);

    // Flatten heatmap data from all records
    const combinedHeatmapData = [];
    heatmapData.forEach(data => {
      if (data.heatmapData && data.heatmapData.length > 0) {
        combinedHeatmapData.push(...data.heatmapData);
      } else {
        // Add main coordinates as heatmap point
        const riskLevelMapping = {
          'Very Low': 20,
          'Low': 40,
          'Medium': 60,
          'High': 80,
          'Very High': 100
        };
        combinedHeatmapData.push({
          lat: data.coordinates.latitude,
          lng: data.coordinates.longitude,
          riskLevel: riskLevelMapping[data.riskLevel] || 60,
          type: data.type
        });
      }
    });

    res.json({
      success: true,
      data: combinedHeatmapData
    });
  } catch (error) {
    console.error('Get calamity heatmap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching calamity heatmap data'
    });
  }
};

// @desc    Create calamity data entry
// @route   POST /api/calamity
// @access  Private (Authority only)
const createCalamityData = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const calamityData = new CalamityData(req.body);
    await calamityData.save();

    res.status(201).json({
      success: true,
      message: 'Calamity data created successfully',
      data: calamityData
    });
  } catch (error) {
    console.error('Create calamity data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating calamity data'
    });
  }
};

// @desc    Update calamity data
// @route   PUT /api/calamity/:id
// @access  Private (Authority only)
const updateCalamityData = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const calamityData = await CalamityData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!calamityData) {
      return res.status(404).json({
        success: false,
        message: 'Calamity data not found'
      });
    }

    res.json({
      success: true,
      message: 'Calamity data updated successfully',
      data: calamityData
    });
  } catch (error) {
    console.error('Update calamity data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating calamity data'
    });
  }
};

module.exports = {
  getCalamityData,
  getLatestCalamityAnalysis,
  getCalamityHeatmap,
  createCalamityData,
  updateCalamityData
};
