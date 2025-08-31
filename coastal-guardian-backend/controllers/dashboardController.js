const Alert = require('../models/Alert');
const Request = require('../models/Request');
const AlgaeData = require('../models/AlgaeData');
const CalamityData = require('../models/CalamityData');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Authority only)
const getDashboardStats = async (req, res) => {
  try {
    // Get counts for different metrics
    const [
      activeAlerts,
      pendingRequests,
      resolvedIssues,
      totalAlerts,
      totalRequests,
      approvedRequests,
      rejectedRequests,
      highSeverityAlerts,
      recentActivity
    ] = await Promise.all([
      // Active alerts count
      Alert.countDocuments({ status: 'active' }),
      
      // Pending requests count
      Request.countDocuments({ status: 'pending' }),
      
      // Resolved issues count (resolved alerts + approved requests)
      Promise.all([
        Alert.countDocuments({ status: 'resolved' }),
        Request.countDocuments({ status: 'approved' })
      ]).then(([resolved, approved]) => resolved + approved),
      
      // Total alerts
      Alert.countDocuments(),
      
      // Total requests
      Request.countDocuments(),
      
      // Approved requests
      Request.countDocuments({ status: 'approved' }),
      
      // Rejected requests
      Request.countDocuments({ status: 'rejected' }),
      
      // High severity alerts
      Alert.countDocuments({ severity: { $in: ['High', 'Critical'] } }),
      
      // Recent activity (last 24 hours)
      Promise.all([
        Alert.countDocuments({ 
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        }),
        Request.countDocuments({ 
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
        })
      ]).then(([alerts, requests]) => alerts + requests)
    ]);

    // Calculate response rate
    const responseRate = totalRequests > 0 
      ? ((approvedRequests + rejectedRequests) / totalRequests * 100).toFixed(1)
      : 0;

    const stats = {
      activeAlerts,
      pendingRequests,
      resolvedIssues,
      totalAlerts,
      totalRequests,
      approvedRequests,
      rejectedRequests,
      highSeverityAlerts,
      recentActivity,
      responseRate: parseFloat(responseRate)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard statistics'
    });
  }
};

// @desc    Get recent activity
// @route   GET /api/dashboard/activity
// @access  Private (Authority only)
const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const days = parseInt(req.query.days) || 7;
    
    const dateFilter = {
      createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    };

    // Get recent alerts and requests
    const [recentAlerts, recentRequests] = await Promise.all([
      Alert.find(dateFilter)
        .populate('authorityId', 'username')
        .select('type location description createdAt severity status')
        .sort({ createdAt: -1 })
        .limit(limit),
      
      Request.find(dateFilter)
        .select('type location description reporter createdAt status')
        .sort({ createdAt: -1 })
        .limit(limit)
    ]);

    // Combine and format activity
    const activity = [];
    
    recentAlerts.forEach(alert => {
      activity.push({
        id: alert._id,
        type: 'alert',
        title: `${alert.type} - ${alert.location}`,
        description: alert.description,
        author: alert.authorityId?.username || 'System',
        severity: alert.severity,
        status: alert.status,
        createdAt: alert.createdAt
      });
    });

    recentRequests.forEach(request => {
      activity.push({
        id: request._id,
        type: 'request',
        title: `${request.type} Report - ${request.location}`,
        description: request.description,
        author: request.reporter,
        status: request.status,
        createdAt: request.createdAt
      });
    });

    // Sort by creation date (newest first)
    activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: activity.slice(0, limit)
    });
  } catch (error) {
    console.error('Get recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching recent activity'
    });
  }
};

// @desc    Get alerts by type distribution
// @route   GET /api/dashboard/alerts-distribution
// @access  Private (Authority only)
const getAlertsDistribution = async (req, res) => {
  try {
    const distribution = await Alert.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: distribution
    });
  } catch (error) {
    console.error('Get alerts distribution error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching alerts distribution'
    });
  }
};

// @desc    Get time-based analytics
// @route   GET /api/dashboard/analytics
// @access  Private (Authority only)
const getTimeBasedAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [alertsOverTime, requestsOverTime] = await Promise.all([
      Alert.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      
      Request.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        alerts: alertsOverTime,
        requests: requestsOverTime
      }
    });
  } catch (error) {
    console.error('Get time-based analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getAlertsDistribution,
  getTimeBasedAnalytics
};
