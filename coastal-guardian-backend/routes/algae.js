const express = require('express');
const { body } = require('express-validator');
const {
  getAlgaeData,
  getLatestAlgaeAnalysis,
  getAlgaeHeatmap,
  createAlgaeData,
  updateAlgaeData
} = require('../controllers/algaeController');
const { auth, requireAuthority } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const algaeDataValidation = [
  body('region')
    .trim()
    .notEmpty()
    .withMessage('Region is required'),
  body('coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  body('coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  body('intensity')
    .isInt({ min: 0, max: 100 })
    .withMessage('Intensity must be between 0 and 100'),
  body('temperature')
    .isNumeric()
    .withMessage('Temperature must be a number'),
  body('nutrientLevel')
    .isNumeric()
    .withMessage('Nutrient level must be a number')
];

// @route   GET /api/algae
// @desc    Get all algae data
// @access  Private (Authority only)
router.get('/', auth, requireAuthority, getAlgaeData);

// @route   GET /api/algae/latest
// @desc    Get latest algae analysis
// @access  Private (Authority only)
router.get('/latest', auth, requireAuthority, getLatestAlgaeAnalysis);

// @route   GET /api/algae/heatmap
// @desc    Get algae heatmap data
// @access  Private (Authority only)
router.get('/heatmap', auth, requireAuthority, getAlgaeHeatmap);

// @route   POST /api/algae
// @desc    Create algae data entry
// @access  Private (Authority only)
router.post('/', auth, requireAuthority, algaeDataValidation, createAlgaeData);

// @route   PUT /api/algae/:id
// @desc    Update algae data
// @access  Private (Authority only)
router.put('/:id', auth, requireAuthority, algaeDataValidation, updateAlgaeData);

module.exports = router;
