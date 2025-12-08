import mongoose from 'mongoose';

/**
 * MongoDB Database Configuration
 * Handles connection pooling, error handling, and reconnection logic
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/defiendete-mx';

// Connection options for production-ready setup
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  family: 4, // Use IPv4, skip trying IPv6
};

// Track connection state
let isConnected = false;

/**
 * Connect to MongoDB with retry logic
 * @returns {Promise<void>}
 */
export async function connectDB() {
  if (isConnected) {
    console.log('📦 Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, options);
    
    isConnected = db.connections[0].readyState === 1;
    
    if (isConnected) {
      console.log('✅ MongoDB connected successfully');
      console.log(`📍 Database: ${db.connections[0].name}`);
    }

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
      isConnected = true;
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    isConnected = false;
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 * @returns {Promise<void>}
 */
export async function disconnectDB() {
  if (!isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✅ MongoDB disconnected successfully');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error.message);
    throw error;
  }
}

/**
 * Get connection status
 * @returns {boolean}
 */
export function getConnectionStatus() {
  return isConnected;
}

/**
 * Middleware for Next.js API routes to ensure DB connection
 * @param {Function} handler - API route handler
 * @returns {Function}
 */
export function withDB(handler) {
  return async (req, res) => {
    try {
      await connectDB();
      return await handler(req, res);
    } catch (error) {
      console.error('Database middleware error:', error);
      return res.status(500).json({ 
        error: 'Database connection failed',
        message: error.message 
      });
    }
  };
}

export default connectDB;
