const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

// Middleware to attach db to request
const dbMiddleware = (req, res, next) => {
  req.db = getDB();
  next();
};

module.exports = { connectDB, getDB, dbMiddleware };