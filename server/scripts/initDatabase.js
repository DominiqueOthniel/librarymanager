const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Category = require('../models/Category');
require('dotenv').config();

// Initialize database function
const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing Library Manager database...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Check if we should seed sample data
    const shouldSeed = String(process.env.SEED_SAMPLE || '').toLowerCase() === 'true';
    
    if (shouldSeed) {
      console.log('🌱 Seeding sample data (SEED_SAMPLE=true)');
      await insertSampleData();
    } else {
      console.log('✅ Database initialized without sample data');
      console.log('💡 To seed sample data, set SEED_SAMPLE=true in your .env file');
    }
    
    console.log('🎉 Database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

// Insert sample data
const insertSampleData = async () => {
  try {
    // Insert categories
    const categories = [
      { name: 'Fiction', description: 'Novels and fictional works' },
      { name: 'Non-Fiction', description: 'Biographies, history, and factual works' },
      { name: 'Science', description: 'Scientific literature and research' },
      { name: 'Technology', description: 'Computer science and technology books' },
      { name: 'Biography', description: 'Life stories and memoirs' },
      { name: 'History', description: 'Historical accounts and analysis' }
    ];
    
    for (const category of categories) {
      await Category.findOneAndUpdate(
        { name: category.name },
        category,
        { upsert: true, new: true }
      );
      console.log(`✅ Category: ${category.name}`);
    }
    
    console.log('✅ Sample data inserted successfully');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    throw error;
  }
};

// Run if executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
