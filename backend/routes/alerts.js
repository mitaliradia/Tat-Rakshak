const express = require('express');
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate('author', 'username organization')
      .sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new alert (authorized users only)
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, severity, category, location, expiresAt } = req.body;
    
    const alert = new Alert({
      title,
      description,
      severity,
      category,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat]
      },
      author: req.user.id,
      expiresAt: new Date(expiresAt)
    });
    
    await alert.save();
    await alert.populate('author', 'username organization');
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete alert (authorized users only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    // Check if user is author or admin
    if (alert.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;