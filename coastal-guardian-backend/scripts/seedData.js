require('dotenv').config();
const mongoose = require('mongoose');
const Alert = require('../models/Alert');
const User = require('../models/User');

const sampleAlerts = [
  {
    type: 'Pollution',
    location: 'Bay of Bengal - Cox\'s Bazar',
    description: 'Oil sheen observed near fishing zone. Immediate attention required.',
    severity: 'High',
    status: 'active',
    comments: [
      { user: 'Local Fisherman', text: 'The oil spill is affecting our daily catch.' },
      { user: 'Marine Biologist', text: 'This could harm marine life significantly.' }
    ]
  },
  {
    type: 'Illegal Dumping',
    location: 'Mumbai Harbor',
    description: 'Multiple bags thrown from a vessel at night. Witnesses reported industrial waste.',
    severity: 'Medium',
    status: 'active',
    comments: [
      { user: 'Harbor Patrol', text: 'We are investigating this incident.' },
      { user: 'Environmental Officer', text: 'Sample collection is in progress.' }
    ]
  },
  {
    type: 'Shrimp farming',
    location: 'Sundarbans Delta',
    description: 'Unauthorized expansion near mangrove edges detected by satellite imagery.',
    severity: 'Medium',
    status: 'investigating',
    comments: [
      { user: 'Forest Department', text: 'We are conducting field verification.' }
    ]
  },
  {
    type: 'Natural Calamity',
    location: 'Digha Beach, West Bengal',
    description: 'Rapid erosion observed over the past month. Local infrastructure at risk.',
    severity: 'High',
    status: 'active',
    comments: [
      { user: 'Geological Survey', text: 'Erosion rate has increased by 30% this year.' }
    ]
  },
  {
    type: 'Pollution',
    location: 'Kanyakumari Coast',
    description: 'Large accumulation of plastic debris spotted near the shore.',
    severity: 'Low',
    status: 'resolved',
    comments: [
      { user: 'Cleanup Volunteer', text: 'Beach cleanup drive organized successfully.' },
      { user: 'Local Authority', text: 'Most debris has been cleared.' }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find an authority user to assign alerts to
    let authorityUser = await User.findOne({ role: 'authority' });
    
    if (!authorityUser) {
      // Create authority user if doesn't exist
      authorityUser = new User({
        email: 'authority@test.com',
        password: 'password123',
        username: 'testauthority',
        role: 'authority',
        organization: 'Coastal Authority Test',
        isActive: true
      });
      await authorityUser.save();
      console.log('✅ Created authority user');
    }

    // Check if alerts already exist
    const existingAlerts = await Alert.countDocuments();
    
    if (existingAlerts > 0) {
      console.log(`Database already has ${existingAlerts} alerts. Skipping seed.`);
      console.log('To reseed, delete existing alerts first.');
      process.exit(0);
    }

    // Create alerts with authority reference one by one
    const createdAlerts = [];
    for (const alertData of sampleAlerts) {
      try {
        const alert = new Alert({
          ...alertData,
          authorityId: authorityUser._id
        });
        const savedAlert = await alert.save();
        createdAlerts.push(savedAlert);
        console.log(`✅ Created alert: ${alertData.type} - ${alertData.location}`);
      } catch (err) {
        console.error(`❌ Failed to create alert ${alertData.location}:`, err.message);
      }
    }

    // Display created alerts
    console.log('\n📋 Sample alerts created:');
    createdAlerts.forEach((alert, index) => {
      console.log(`${index + 1}. ${alert.type} - ${alert.location} (${alert.status})`);
    });

    console.log('\n🎉 Database seeded successfully!');
    console.log('You can now see alerts in your frontend application.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleAlerts };
