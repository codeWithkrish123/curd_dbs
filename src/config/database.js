const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let db;

// Database connection function
const connectDB = async () => {
  try {
    if (db) {
      return db;
    }

    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected Successfully');

    return db;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
};

// Get database instance
const getDB = () => {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return db;
};

// Close database connection
const closeDB = async () => {
  try {
    if (db) {
      await db.close();
      db = null;
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error.message);
    throw error;
  }
};

module.exports = {
  connectDB,
  getDB,
  closeDB
};
