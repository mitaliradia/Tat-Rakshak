const Alert = require('../models/Alert');
const { validationResult } = require('express-validator');

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Public
const getAlerts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, type, location } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };

    const alerts = await Alert.find(filter)
      .populate('authorityId', 'username organization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Alert.countDocuments(filter);

    // Format alerts to match frontend structure
    const formattedAlerts = alerts.map(alert => ({
      id: alert._id,
      type: alert.type,
      location: alert.location,
      description: alert.description,
      time: alert.timeAgo,
      comments: alert.comments,
      severity: alert.severity,
      status: alert.status,
      coordinates: alert.coordinates,
      media: alert.media,
      authorityInfo: alert.authorityId
    }));

    res.json({
      success: true,
      data: formattedAlerts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching alerts'
    });
  }
};

// @desc    Get single alert
// @route   GET /api/alerts/:id
// @access  Public
const getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('authorityId', 'username organization');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    const formattedAlert = {
      id: alert._id,
      type: alert.type,
      location: alert.location,
      description: alert.description,
      time: alert.timeAgo,
      comments: alert.comments,
      severity: alert.severity,
      status: alert.status,
      coordinates: alert.coordinates,
      media: alert.media,
      authorityInfo: alert.authorityId
    };

    res.json({
      success: true,
      data: formattedAlert
    });
  } catch (error) {
    console.error('Get alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching alert'
    });
  }
};

// @desc    Create new alert
// @route   POST /api/alerts
// @access  Private (Authority only)
const createAlert = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      console.log('Request body:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Validation failed: ' + errors.array().map(e => e.msg).join(', '),
        errors: errors.array(),
        received_data: req.body
      });
    }

    const alertData = {
      ...req.body,
      authorityId: req.user?._id || '68b382c536e42f03e6d8064a' // Use test authority ID if no user
    };

    const alert = new Alert(alertData);
    await alert.save();

    await alert.populate('authorityId', 'username organization');

    const formattedAlert = {
      id: alert._id,
      type: alert.type,
      location: alert.location,
      description: alert.description,
      time: alert.timeAgo,
      comments: alert.comments,
      severity: alert.severity,
      status: alert.status,
      coordinates: alert.coordinates,
      media: alert.media,
      authorityInfo: alert.authorityId
    };

    res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      data: formattedAlert
    });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating alert'
    });
  }
};

// @desc    Update alert
// @route   PUT /api/alerts/:id
// @access  Private (Authority only)
const updateAlert = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Check if user is the alert creator or admin
    if (alert.authorityId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this alert'
      });
    }

    const updatedAlert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('authorityId', 'username organization');

    const formattedAlert = {
      id: updatedAlert._id,
      type: updatedAlert.type,
      location: updatedAlert.location,
      description: updatedAlert.description,
      time: updatedAlert.timeAgo,
      comments: updatedAlert.comments,
      severity: updatedAlert.severity,
      status: updatedAlert.status,
      coordinates: updatedAlert.coordinates,
      media: updatedAlert.media,
      authorityInfo: updatedAlert.authorityId
    };

    res.json({
      success: true,
      message: 'Alert updated successfully',
      data: formattedAlert
    });
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating alert'
    });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private (Authority only)
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    // Check if user is the alert creator or admin
    if (alert.authorityId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this alert'
      });
    }

    await Alert.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Alert deleted successfully'
    });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting alert'
    });
  }
};

// @desc    Add comment to alert
// @route   POST /api/alerts/:id/comments
// @access  Public
const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }

    const comment = {
      user: req.body.user || 'Anonymous',
      text: req.body.text
    };

    alert.comments.push(comment);
    await alert.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding comment'
    });
  }
};

module.exports = {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
  addComment
};
