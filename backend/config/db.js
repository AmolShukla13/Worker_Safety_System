const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'shuklaamulshukla@gmail.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123@', salt);
      const defaultAdmin = new User({
        name: 'Amol Shukla',
        email: 'shuklaamulshukla@gmail.com',
        password: hashedPassword,
        role: 'Admin',
      });
      await defaultAdmin.save();
      console.log('✅ Default Admin seeded successfully: shuklaamulshukla@gmail.com / 123@');
    }
  } catch (err) {
    console.error('❌ Admin seeding failed:', err.message);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected to MongoDB ATLAS Cloud Successfully!`);
    await seedAdmin();
  } catch (error) {
    console.error(`❌ Atlas Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;