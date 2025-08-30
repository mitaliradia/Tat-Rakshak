// backend/scripts/initDB.js
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const initDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/coastal-alert', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      email: 'admin@coastalalert.org',
      organization: 'Coastal Alert Administration'
    });
    await adminUser.save();

    // Create authority user
    const authorityPassword = await bcrypt.hash('authority123', 12);
    const authorityUser = new User({
      username: 'coastal_authority',
      password: authorityPassword,
      role: 'authority',
      email: 'authority@coastalalert.org',
      organization: 'Coastal Management Authority'
    });
    await authorityUser.save();

    console.log('Database initialized with default users');
    console.log('Admin credentials: username: admin, password: admin123');
    console.log('Authority credentials: username: coastal_authority, password: authority123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDB();