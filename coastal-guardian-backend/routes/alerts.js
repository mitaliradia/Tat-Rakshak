const express = require('express');
const { body } = require('express-validator');
const {
  getAlerts,
  getAlert,
  createAlert,
  updateAlert,
  deleteAlert,
  addComment
} = require('../controllers/alertController');
const { auth, requireAuthority } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const alertValidation = [
  body('type')
    .notEmpty()
    .isIn(['Pollution', 'Illegal Dumping', 'Shrimp farming', 'Oil Spill', 'Algae Bloom', 'Natural Calamity', 'Other'])
    .withMessage('Please provide a valid alert type'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('description')
    .trim()
    .isLength({ min: 5, max: 1000 }) // Reduced minimum from 10 to 5
    .withMessage('Description must be between 5 and 1000 characters'),
  body('severity')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Please provide a valid severity level'),
  body('status')
    .optional()
    .isIn(['active', 'resolved', 'investigating'])
    .withMessage('Please provide a valid status')
];

const commentValidation = [
  body('text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters'),
  body('user')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Username must be between 1 and 50 characters')
];

// @route   GET /api/alerts
// @desc    Get all alerts
// @access  Public
router.get('/', getAlerts);

// @route   GET /api/alerts/:id
// @desc    Get single alert
// @access  Public
router.get('/:id', getAlert);

// @route   POST /api/alerts
// @desc    Create new alert
// @access  Private (Authority only)
// Temporarily removing auth for testing
router.post('/', alertValidation, createAlert);

// @route   PUT /api/alerts/:id
// @desc    Update alert
// @access  Private (Authority only)
router.put('/:id', auth, requireAuthority, alertValidation, updateAlert);

// @route   DELETE /api/alerts/:id
// @desc    Delete alert
// @access  Private (Authority only)
router.delete('/:id', auth, requireAuthority, deleteAlert);

// @route   POST /api/alerts/:id/comments
// @desc    Add comment to alert
// @access  Public
router.post('/:id/comments', commentValidation, addComment);

module.exports = router;
