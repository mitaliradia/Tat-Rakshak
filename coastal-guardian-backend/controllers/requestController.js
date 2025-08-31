const Request = require('../models/Request');
const { validationResult } = require('express-validator');

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Authority only)
const getRequests = async (req, res) => {
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

    const requests = await Request.find(filter)
      .populate('reviewedBy', 'username organization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Request.countDocuments(filter);

    // Format requests to match frontend structure
    const formattedRequests = requests.map(request => ({
      id: request._id,
      reporter: request.reporter,
      type: request.type,
      location: request.location,
      description: request.description,
      time: request.timeAgo,
      status: request.status,
      coordinates: request.coordinates,
      media: request.media,
      reviewedBy: request.reviewedBy,
      reviewedAt: request.reviewedAt,
      reviewNotes: request.reviewNotes
    }));

    res.json({
      success: true,
      data: formattedRequests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching requests'
    });
  }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private (Authority only)
const getRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('reviewedBy', 'username organization');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    const formattedRequest = {
      id: request._id,
      reporter: request.reporter,
      type: request.type,
      location: request.location,
      description: request.description,
      time: request.timeAgo,
      status: request.status,
      coordinates: request.coordinates,
      media: request.media,
      reviewedBy: request.reviewedBy,
      reviewedAt: request.reviewedAt,
      reviewNotes: request.reviewNotes
    };

    res.json({
      success: true,
      data: formattedRequest
    });
  } catch (error) {
    console.error('Get request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching request'
    });
  }
};

// @desc    Submit new request
// @route   POST /api/requests
// @access  Public
const submitRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const requestData = {
      ...req.body,
      reporter: req.body.reporter || `anon-${Math.floor(Math.random() * 10000)}`
    };

    const request = new Request(requestData);
    await request.save();

    const formattedRequest = {
      id: request._id,
      reporter: request.reporter,
      type: request.type,
      location: request.location,
      description: request.description,
      time: request.timeAgo,
      status: request.status,
      coordinates: request.coordinates,
      media: request.media
    };

    res.status(201).json({
      success: true,
      message: 'Request submitted successfully',
      data: formattedRequest
    });
  } catch (error) {
    console.error('Submit request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting request'
    });
  }
};

// @desc    Update request status (approve/reject)
// @route   PUT /api/requests/:id/status
// @access  Private (Authority only)
const updateRequestStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, reviewNotes } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Update request
    request.status = status;
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    if (reviewNotes) request.reviewNotes = reviewNotes;

    await request.save();
    await request.populate('reviewedBy', 'username organization');

    const formattedRequest = {
      id: request._id,
      reporter: request.reporter,
      type: request.type,
      location: request.location,
      description: request.description,
      time: request.timeAgo,
      status: request.status,
      coordinates: request.coordinates,
      media: request.media,
      reviewedBy: request.reviewedBy,
      reviewedAt: request.reviewedAt,
      reviewNotes: request.reviewNotes
    };

    res.json({
      success: true,
      message: `Request ${status} successfully`,
      data: formattedRequest
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating request status'
    });
  }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private (Authority only)
const deleteRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    await Request.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Request deleted successfully'
    });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting request'
    });
  }
};

module.exports = {
  getRequests,
  getRequest,
  submitRequest,
  updateRequestStatus,
  deleteRequest
};
