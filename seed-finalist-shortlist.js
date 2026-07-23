const mongoose = require('mongoose');

const data = [
  {
    finalistName: 'Sharon Kendi Kirimi',
    phoneNumber: '+254706363514',
    track: 'Athletics & Sports Tech',
    projectTitle: 'OptiFuel',
    organization: 'Moi University',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Leonard Kipkemoi Bett',
    phoneNumber: '+254 729 520 130',
    track: 'Athletics & Sports Tech',
    projectTitle: 'Athech',
    organization: 'SportTechies Innovations Ltd',
    projectStage: 'MVP / Beta',
  },
  {
    finalistName: 'Lynne Mittei',
    phoneNumber: '+254 745 464 600',
    track: 'Hospitality & Tourism',
    projectTitle: 'HotelIQ Kenya',
    organization: 'University of Eastern Africa Baraton (UEAB)',
    projectStage: 'MVP / Beta',
  },
  {
    finalistName: 'Ferryll Lerma Ogada',
    phoneNumber: '0704 623 331',
    track: 'Hospitality & Tourism',
    projectTitle: 'BambaFind',
    organization: 'University of Eastern Africa Baraton',
    projectStage: 'Idea Stage',
  },
  {
    finalistName: 'Ian Kinyuru Njenga',
    phoneNumber: '+254 741 784 323',
    track: 'Hospitality & Tourism',
    projectTitle: 'Aurora',
    organization: 'Harmony',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Sherry Meroka',
    phoneNumber: '+254 748 963 037',
    track: 'Agriculture & Food Systems',
    projectTitle: 'SolarChill Smart: IoT-Enabled Solar-Powered Refrigeration System for Off-Grid Food Preservation',
    organization: 'Kisii University',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Ken Bett',
    phoneNumber: '+254 740 121 019',
    track: 'Agriculture & Food Systems',
    projectTitle: 'Shamba AI: Smart Marketplace for Modern Farming',
    organization: 'Graduate, Technical University of Kenya (2025)',
    projectStage: 'Idea Stage',
  },
  {
    finalistName: 'Joram Mwanyika',
    phoneNumber: '+254 794 728 645',
    track: 'Agriculture & Food Systems',
    projectTitle: 'AgriTwin (Mkulima Mdogo)',
    organization: 'Moi University',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Maureen Njoki',
    phoneNumber: '0112854091',
    track: 'EdTech & Skills Development',
    projectTitle: 'Genesis',
    organization: 'Start Up',
    projectStage: 'Idea Stage',
  },
  {
    finalistName: 'Daniel Wachira Githinji',
    phoneNumber: '+254710825792',
    track: 'EdTech & Skills Development',
    projectTitle: 'SyncSenta',
    organization: 'Kamwenja Teachers Training College',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Farooq Shaaban',
    phoneNumber: '+254757697769',
    track: 'EdTech & Skills Development',
    projectTitle: 'U-pass',
    organization: 'University of Eldoret',
    projectStage: 'MVP / Beta',
  },
  {
    finalistName: 'Sharon Gaithi',
    phoneNumber: '+254798863568',
    track: 'Fintech & Digital Economy',
    projectTitle: 'SheEarns',
    organization: 'University of Eastern Africa Baraton (UEAB)',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Wilson Ndambuki',
    phoneNumber: '+254794709253',
    track: 'Fintech & Digital Economy',
    projectTitle: 'TakaTrack',
    organization: 'Kibabii University',
    projectStage: 'Idea Stage',
  },
  {
    finalistName: 'Patrick Ian',
    phoneNumber: '+254795618876',
    track: 'Fintech & Digital Economy',
    projectTitle: 'Silverline Tech',
    organization: 'Independent',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Derrick Simiyu Wefwafwa',
    phoneNumber: '+254791932754',
    track: 'Medical & HealthTech',
    projectTitle: 'AI-Powered Decentralised Micro-Laboratory System for Primary Healthcare',
    organization: 'Moi University',
    projectStage: 'Idea Stage',
  },
  {
    finalistName: 'Mburu Karanja',
    phoneNumber: '+254793833505',
    track: 'Medical & HealthTech',
    projectTitle: 'BloodLink',
    organization: 'Moi University',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'John Aleka',
    phoneNumber: '+254713346629',
    track: 'Medical & HealthTech',
    projectTitle: 'DawaReach',
    organization: 'Moi University',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Betty Kiwugha',
    phoneNumber: '0797621542',
    track: 'Medical & HealthTech',
    projectTitle: 'CerviTrack',
    organization: 'Moi University',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Kevin Mutai',
    phoneNumber: '0728591137',
    track: 'Medical & HealthTech',
    projectTitle: 'NutriPeel',
    organization: 'Moi University',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Joseph Ndavuti',
    phoneNumber: '+254791918399',
    track: 'Medical & HealthTech',
    projectTitle: 'Vortex Engine',
    organization: 'Moi University',
    projectStage: 'Prototype',
  },
  {
    finalistName: 'Joy Letting',
    phoneNumber: '+254785985354',
    track: 'Fintech & Digital Economy',
    projectTitle: 'UshikaDAO',
    organization: 'Independent',
    projectStage: 'MVP / Beta',
  },
];

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://jacobmbuguait_db_user:VTcBgVuvlCv9CKrX@cube0hub.3ikbtll.mongodb.net/cube0hub?retryWrites=true&w=majority';

  await mongoose.connect(mongoUri);

  const db = mongoose.connection.db;
  const collection = db.collection('finalistshortlists');

  const docs = data.map((item, index) => ({
    ...item,
    applicantId: `seed-${String(index + 1).padStart(3, '0')}`,
    shortlisted: true,
    originalRank: index + 1,
    rankOnFinalistList: index + 1,
    matchedAt: new Date(),
  }));

  await collection.deleteMany({});
  const result = await collection.insertMany(docs);

  console.log(`Inserted ${result.insertedCount} finalist shortlist documents.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
