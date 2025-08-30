const mongoose = require('mongoose');

const SeaLevelDataSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  sea_level_change: {
    type: Number,
    required: true
  },
  erosion_rate: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SeaLevelData', SeaLevelDataSchema);