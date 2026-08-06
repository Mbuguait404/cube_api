const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://jacobmbuguait_db_user:VTcBgVuvlCv9CKrX@cube0hub.3ikbtll.mongodb.net/cube0hub?retryWrites=true&w=majority';
  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;

  const shortlistCount = await db.collection('finalistshortlists').countDocuments();
  const settings = await db.collection('innovationsettings').findOne();

  console.log('Shortlist entries:', shortlistCount);
  console.log('Settings:', JSON.stringify(settings, null, 2));

  await mongoose.disconnect();
  process.exit(0);
}

check().catch(e => { console.error(e); process.exit(1); });
