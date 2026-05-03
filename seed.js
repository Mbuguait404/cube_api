const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...', uri);
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const password = await bcrypt.hash('Admin@123', 10);

  const admin = {
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@thecube.com',
    password,
    role: 'SuperAdmin',
    status: 'active',
    isFirstLogin: false,
    mustChangePassword: false,
    profileCompletion: 100,
    communities: [],
    badges: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await db.collection('users').updateOne(
    { email: admin.email },
    { $set: admin },
    { upsert: true }
  );

  console.log('Admin user seeded! (admin@thecube.com / Admin@123)');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Error seeding admin user:', err);
  process.exit(1);
});
