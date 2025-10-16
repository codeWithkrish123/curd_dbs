const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let client;
let db;

// Database connection function
const connectDB = async () => {
  try {
    if (client && db) {
      return { client, db };
    }

    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(mongoURI);
    await client.connect();

    db = client.db(); // Use default database from connection string
    console.log('MongoDB Connected Successfully');

    return { client, db };
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

// Get client instance
const getClient = () => {
  if (!client) {
    throw new Error('Database not connected. Call connectDB first.');
  }
  return client;
};

// Close database connection
const closeDB = async () => {
  try {
    if (client) {
      await client.close();
      client = null;
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
  getClient,
  closeDB
};
