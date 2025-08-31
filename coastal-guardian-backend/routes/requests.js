const express = require('express');
const { body } = require('express-validator');
const {
  getRequests,
  getRequest,
  submitRequest,
  updateRequestStatus,
  deleteRequest
} = require('../controllers/requestController');
const { auth, requireAuthority } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const requestValidation = [
  body('type')
    .notEmpty()
    .isIn(['Pollution', 'Illegal Dumping', 'Shrimp farming', 'Oil Spill', 'Algae Bloom', 'Natural Calamity', 'Other'])
    .withMessage('Please provide a valid request type'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('reporter')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Reporter name must be between 1 and 50 characters')
];

const statusValidation = [
  body('status')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Status must be pending, approved, or rejected'),
  body('reviewNotes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Review notes must not exceed 500 characters')
];

// @route   GET /api/requests
// @desc    Get all requests
// @access  Private (Authority only)
router.get('/', auth, requireAuthority, getRequests);

// @route   GET /api/requests/:id
// @desc    Get single request
// @access  Private (Authority only)
router.get('/:id', auth, requireAuthority, getRequest);

// @route   POST /api/requests
// @desc    Submit new request
// @access  Public
router.post('/', requestValidation, submitRequest);

// @route   PUT /api/requests/:id/status
// @desc    Update request status (approve/reject)
// @access  Private (Authority only)
router.put('/:id/status', auth, requireAuthority, statusValidation, updateRequestStatus);

// @route   DELETE /api/requests/:id
// @desc    Delete request
// @access  Private (Authority only)
router.delete('/:id', auth, requireAuthority, deleteRequest);

module.exports = router;
