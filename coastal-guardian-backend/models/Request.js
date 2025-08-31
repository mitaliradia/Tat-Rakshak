const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  reporter: {
    type: String,
    required: true,
    default: function() {
      return `anon-${Math.floor(Math.random() * 10000)}`;
    }
  },
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document']
    },
    url: String,
    filename: String
  }],
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Create time ago virtual field
requestSchema.virtual('timeAgo').get(function() {
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
requestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Request', requestSchema);
