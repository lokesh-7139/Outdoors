const mongoose = require('mongoose');

const connectDB = () => {
  const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

  return mongoose.connect(DB);
};

module.exports = connectDB;
