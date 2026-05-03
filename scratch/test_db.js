const mongoose = require('mongoose');
const uri = "mongodb+srv://jacobmbuguait_db_user:VTcBgVuvlCv9CKrX@cube0hub.3ikbtll.mongodb.net";

console.log("Attempting to connect to MongoDB...");
mongoose.connect(uri)
  .then(() => {
    console.log("Successfully connected!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
