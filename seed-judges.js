const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const judges = [
  {
    firstName: 'David',
    lastName: '',
    email: 'David@thecube.co.ke',
    password: 'David123',
  },
  {
    firstName: 'Ian',
    lastName: '',
    email: 'Ian@thecube.co.ke',
    password: 'Ian123',
  },
  {
    firstName: 'Jacinta',
    lastName: '',
    email: 'Jacinta@thecube.co.ke',
    password: 'Jacinta123',
  },
  {
    firstName: 'Pamela',
    lastName: '',
    email: 'Pamela@thecube.co.ke',
    password: 'Pamela123',
  },
  {
    firstName: 'Akama',
    lastName: '',
    email: 'Akama@thecube.co.ke',
    password: 'Akama123',
  },
];

async function main() {
  const mongoUri =
    process.env.MONGODB_URI ||
    'mongodb+srv://jacobmbuguait_db_user:VTcBgVuvlCv9CKrX@cube0hub.3ikbtll.mongodb.net/cube0hub?retryWrites=true&w=majority';

  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;
  const collection = db.collection('users');

  for (const judge of judges) {
    const hashedPassword = await bcrypt.hash(judge.password, 10);

    const user = {
      firstName: judge.firstName,
      lastName: judge.lastName,
      email: judge.email,
      password: hashedPassword,
      role: 'Judge',
      status: 'active',
      isFirstLogin: false,
      mustChangePassword: false,
      profileCompletion: 100,
      communities: [],
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { email: user.email },
      { $set: user },
      { upsert: true },
    );

    console.log(`Seeded: ${judge.firstName} (${judge.email})`);
  }

  console.log(`${judges.length} judge accounts seeded.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
