const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

mongoose.connect(MONGODB_URI);
const db = mongoose.connection;

// Database connection function
const connectDB = async () => {
  try {
    await db.openUri(MONGODB_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
};

// Close database connection
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database connection:', error.message);
    throw error;
  }
};

module.exports = { connectDB, closeDB };
