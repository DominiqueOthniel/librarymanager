const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Book = require('../models/Book');
const Borrower = require('../models/Borrower');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
require('dotenv').config();

// Clean database function
const cleanDatabase = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    console.log('🗑️  Deleting all transactions...');
    await Transaction.deleteMany({});
    console.log('✅ Transactions deleted');
    
    console.log('🗑️  Deleting all books...');
    await Book.deleteMany({});
    console.log('✅ Books deleted');
    
    console.log('🗑️  Deleting all borrowers...');
    await Borrower.deleteMany({});
    console.log('✅ Borrowers deleted');
    
    console.log('🗑️  Deleting all categories...');
    await Category.deleteMany({});
    console.log('✅ Categories deleted');
    
    console.log('🎉 Database cleaned successfully!');
    console.log('✅ All data has been removed.');
    console.log('📊 Database is now empty and ready for real data.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    process.exit(1);
  }
};

// Run if executed directly
if (require.main === module) {
  cleanDatabase();
}

module.exports = { cleanDatabase };
