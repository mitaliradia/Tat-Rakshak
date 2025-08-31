require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test authority user already exists
    const existingAuthority = await User.findOne({ email: 'authority@test.com' });
    if (existingAuthority) {
      console.log('Test authority user already exists:');
      console.log('Email: authority@test.com');
      console.log('Password: password123');
      console.log('Role:', existingAuthority.role);
      process.exit(0);
    }

    // Create test authority user
    const authorityUser = new User({
      email: 'authority@test.com',
      password: 'password123',
      username: 'testauthority',
      role: 'authority',
      organization: 'Coastal Authority Test',
      isActive: true
    });

    await authorityUser.save();
    console.log('✅ Test authority user created successfully!');
    console.log('Email: authority@test.com');
    console.log('Password: password123');
    console.log('Role: authority');

    // Check if test regular user already exists
    const existingUser = await User.findOne({ email: 'user@test.com' });
    if (!existingUser) {
      // Create test regular user
      const regularUser = new User({
        email: 'user@test.com',
        password: 'password123',
        username: 'testuser',
        role: 'user',
        isActive: true
      });

      await regularUser.save();
      console.log('✅ Test regular user created successfully!');
      console.log('Email: user@test.com');
      console.log('Password: password123');
      console.log('Role: user');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
