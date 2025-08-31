const express = require('express');
const {
  getDashboardStats,
  getRecentActivity,
  getAlertsDistribution,
  getTimeBasedAnalytics
} = require('../controllers/dashboardController');
const { auth, requireAuthority } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authority access
router.use(auth, requireAuthority);

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Authority only)
router.get('/stats', getDashboardStats);

// @route   GET /api/dashboard/activity
// @desc    Get recent activity
// @access  Private (Authority only)
router.get('/activity', getRecentActivity);

// @route   GET /api/dashboard/alerts-distribution
// @desc    Get alerts by type distribution
// @access  Private (Authority only)
router.get('/alerts-distribution', getAlertsDistribution);

// @route   GET /api/dashboard/analytics
// @desc    Get time-based analytics
// @access  Private (Authority only)
router.get('/analytics', getTimeBasedAnalytics);

module.exports = router;
