const express = require('express');
const Report = require('./Report');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const router = express.Router();

// Email transporter setup - FIXED: createTransporter -> createTransport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all reports (authorized users only)
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new report
router.post('/', async (req, res) => {
  try {
    const { activityType, location, description, image, anonymous } = req.body;
    
    const report = new Report({
      activityType,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      },
      description,
      image,
      anonymous: anonymous !== false
    });
    
    await report.save();
    
    // Send email notification to authorities
    if (process.env.ADMIN_EMAIL) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Coastal Threat Report',
        html: `
          <h2>New Report Submitted</h2>
          <p><strong>Activity Type:</strong> ${activityType}</p>
          <p><strong>Location:</strong> ${location.lat}, ${location.lng}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    }
    
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update report status (authorized users only)
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;