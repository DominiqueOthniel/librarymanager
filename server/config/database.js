const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library-manager';
const RETRY_INTERVAL_MS = 5000;

const connectDB = async (retryCount = 0) => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`❌ MongoDB non disponible: ${error.message}`);
    console.warn(`   Reconnexion dans ${RETRY_INTERVAL_MS / 1000}s... (démarrez MongoDB ou utilisez MongoDB Atlas)`);
    setTimeout(() => connectDB(retryCount + 1), RETRY_INTERVAL_MS);
    return null;
  }
};

const isConnected = () => mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.isConnected = isConnected;
