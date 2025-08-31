const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Pollution', 'Illegal Dumping', 'Shrimp farming', 'Oil Spill', 'Algae Bloom', 'Natural Calamity', 'Other']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'investigating'],
    default: 'active'
  },
  authorityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema],
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document']
    },
    url: String,
    filename: String
  }]
}, {
  timestamps: true
});

// Create time ago virtual field
alertSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffInMinutes = Math.floor((now - created) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
});

// Ensure virtual fields are serialized
alertSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Alert', alertSchema);
