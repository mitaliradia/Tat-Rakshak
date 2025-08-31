const express = require('express');
const path = require('path');
const { uploadSingle, uploadMultiple, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @desc    Upload single file
// @route   POST /api/upload/single
// @access  Public
router.post('/single', (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res);
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
        type: req.file.mimetype.startsWith('image/') ? 'image' : 
              req.file.mimetype.startsWith('video/') ? 'video' : 'document'
      }
    });
  });
});

// @desc    Upload multiple files
// @route   POST /api/upload/multiple
// @access  Public
router.post('/multiple', (req, res) => {
  uploadMultiple(req, res, (err) => {
    if (err) {
      return handleUploadError(err, req, res);
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: `/uploads/${file.filename}`,
      type: file.mimetype.startsWith('image/') ? 'image' : 
            file.mimetype.startsWith('video/') ? 'video' : 'document'
    }));

    res.json({
      success: true,
      message: `${files.length} files uploaded successfully`,
      data: files
    });
  });
});

module.exports = router;
