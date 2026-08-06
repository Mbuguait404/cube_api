const mongoose = require('mongoose');
require('dotenv').config();

async function enable() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://jacobmbuguait_db_user:VTcBgVuvlCv9CKrX@cube0hub.3ikbtll.mongodb.net/cube0hub?retryWrites=true&w=majority';
  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;

  await db.collection('innovationsettings').updateOne(
    {},
    { $set: { isPublicShortlistVisible: true, isPublicVotingOpen: true } },
    { upsert: true },
  );

  const settings = await db.collection('innovationsettings').findOne();
  console.log('Settings updated:', JSON.stringify(settings, null, 2));

  // Also ensure shortlist data exists
  const count = await db.collection('finalistshortlists').countDocuments();
  console.log(`Finalist shortlist entries: ${count}`);

  await mongoose.disconnect();
  process.exit(0);
}

enable().catch(e => { console.error(e); process.exit(1); });
