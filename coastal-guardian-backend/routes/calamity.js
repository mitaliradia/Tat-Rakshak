const express = require('express');
const { body } = require('express-validator');
const {
  getCalamityData,
  getLatestCalamityAnalysis,
  getCalamityHeatmap,
  createCalamityData,
  updateCalamityData
} = require('../controllers/calamityController');
const { auth, requireAuthority } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const calamityDataValidation = [
  body('region')
    .trim()
    .notEmpty()
    .withMessage('Region is required'),
  body('type')
    .isIn(['Tsunami', 'Cyclone', 'Storm Surge', 'Coastal Erosion', 'Flooding', 'Other'])
    .withMessage('Please provide a valid calamity type'),
  body('riskLevel')
    .isIn(['Very Low', 'Low', 'Medium', 'High', 'Very High'])
    .withMessage('Please provide a valid risk level'),
  body('coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('prediction.probability')
    .isInt({ min: 0, max: 100 })
    .withMessage('Probability must be between 0 and 100'),
  body('prediction.timeframe')
    .trim()
    .notEmpty()
    .withMessage('Timeframe is required'),
  body('prediction.impact')
    .isIn(['Minimal', 'Low', 'Moderate', 'High', 'Severe'])
    .withMessage('Please provide a valid impact level')
];

// @route   GET /api/calamity
// @desc    Get all calamity data
// @access  Private (Authority only)
router.get('/', auth, requireAuthority, getCalamityData);

// @route   GET /api/calamity/latest
// @desc    Get latest calamity analysis
// @access  Private (Authority only)
router.get('/latest', auth, requireAuthority, getLatestCalamityAnalysis);

// @route   GET /api/calamity/heatmap
// @desc    Get calamity heatmap data
// @access  Private (Authority only)
router.get('/heatmap', auth, requireAuthority, getCalamityHeatmap);

// @route   POST /api/calamity
// @desc    Create calamity data entry
// @access  Private (Authority only)
router.post('/', auth, requireAuthority, calamityDataValidation, createCalamityData);

// @route   PUT /api/calamity/:id
// @desc    Update calamity data
// @access  Private (Authority only)
router.put('/:id', auth, requireAuthority, calamityDataValidation, updateCalamityData);

module.exports = router;
