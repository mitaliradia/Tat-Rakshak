const mongoose = require('mongoose');

const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// Get sea level data from your Python script
router.get('/sea-level', auth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const data = await db.collection('seaLevelData').find().sort({ timestamp: -1 }).limit(100).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get algae bloom data from your Python script
router.get('/algae-bloom', auth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const data = await db.collection('algaeBloomData').find().sort({ timestamp: -1 }).limit(100).toArray();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get analysis data from your Python script
router.get('/analysis', auth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get the latest analysis data
    const analysisData = await db.collection('analysisData').find().sort({ timestamp: -1 }).limit(1).toArray();
    
    if (analysisData.length === 0) {
      return res.status(404).json({ message: 'No analysis data found' });
    }
    
    res.json(analysisData[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get heatmap data for GEE visualization
router.get('/heatmap/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const db = mongoose.connection.db;
    
    let collectionName;
    if (type === 'sea_level') {
      collectionName = 'seaLevelData';
    } else if (type === 'algae_bloom') {
      collectionName = 'algaeBloomData';
    } else {
      return res.status(400).json({ message: 'Invalid data type' });
    }
    
    const data = await db.collection(collectionName).find().limit(500).toArray();
    
    // Format data for heatmap
    const heatmapData = data.map(item => ({
      lat: item.latitude,
      lng: item.longitude,
      value: type === 'sea_level' ? item.sea_level_change : item.chlorophyll_concentration
    }));
    
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;