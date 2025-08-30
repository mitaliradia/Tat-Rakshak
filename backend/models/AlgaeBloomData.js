const mongoose = require('mongoose');

const AlgaeBloomDataSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  chlorophyll_concentration: {
    type: Number,
    required: true
  },
  water_temperature: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AlgaeBloomData', AlgaeBloomDataSchema);