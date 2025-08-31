const mongoose = require('mongoose');

const calamityDataSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Tsunami', 'Cyclone', 'Storm Surge', 'Coastal Erosion', 'Flooding', 'Other']
  },
  riskLevel: {
    type: String,
    required: true,
    enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High'],
    default: 'Medium'
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
  weatherData: {
    windSpeed: Number,
    pressure: Number,
    temperature: Number,
    humidity: Number,
    visibility: Number
  },
  seaData: {
    waveHeight: Number,
    tideLevel: Number,
    seaTemperature: Number
  },
  analysis: {
    type: String,
    maxlength: 2000
  },
  heatmapData: [{
    lat: Number,
    lng: Number,
    riskLevel: Number,
    type: String
  }],
  graphs: [{
    type: String,
    title: String,
    url: String,
    data: mongoose.Schema.Types.Mixed
  }],
  prediction: {
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    timeframe: {
      type: String,
      required: true
    },
    impact: {
      type: String,
      enum: ['Minimal', 'Low', 'Moderate', 'High', 'Severe'],
      required: true
    },
    recommendedActions: [{
      action: String,
      priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical']
      }
    }]
  },
  status: {
    type: String,
    enum: ['monitoring', 'warning', 'alert', 'resolved'],
    default: 'monitoring'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CalamityData', calamityDataSchema);
