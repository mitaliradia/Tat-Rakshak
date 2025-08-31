const mongoose = require('mongoose');

const algaeDataSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  intensity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  temperature: {
    type: Number,
    required: true
  },
  nutrientLevel: {
    type: Number,
    required: true,
    min: 0
  },
  analysis: {
    type: String,
    maxlength: 2000
  },
  heatmapData: [{
    lat: Number,
    lng: Number,
    intensity: Number
  }],
  graphs: [{
    type: String,
    title: String,
    url: String,
    data: mongoose.Schema.Types.Mixed
  }],
  prediction: {
    spread: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    duration: {
      type: String,
      required: true
    },
    recommendedAction: {
      type: String,
      maxlength: 1000
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AlgaeData', algaeDataSchema);
