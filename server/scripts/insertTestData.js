const mongoose = require('mongoose');
const connectDB = require('../config/database');
const Book = require('../models/Book');
const Borrower = require('../models/Borrower');
const Category = require('../models/Category');
require('dotenv').config();

// Insert test data function
const insertTestData = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    
    // Insert categories
    console.log('📚 Inserting categories...');
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
      console.log(`✅ Category inserted: ${category.name}`);
    }
    
    // Insert books
    console.log('📖 Inserting books...');
    const books = [
      {
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        isbn: '978-2-07-061275-8',
        category: 'Fiction',
        publication_date: new Date('1943-04-06'),
        publisher: 'Gallimard',
        pages: 96,
        language: 'French',
        description: 'Un conte poétique et philosophique sous l\'apparence d\'un conte pour enfants.',
        location: 'Section A, Shelf 1',
        condition: 'Excellent',
        status: 'available',
        borrow_count: 0
      },
      {
        title: 'L\'Étranger',
        author: 'Albert Camus',
        isbn: '978-2-07-036002-4',
        category: 'Fiction',
        publication_date: new Date('1942-06-01'),
        publisher: 'Gallimard',
        pages: 186,
        language: 'French',
        description: 'Un roman philosophique sur l\'absurdité de l\'existence.',
        location: 'Section A, Shelf 2',
        condition: 'Good',
        status: 'available',
        borrow_count: 0
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0-13-235088-4',
        category: 'Technology',
        publication_date: new Date('2008-08-11'),
        publisher: 'Prentice Hall',
        pages: 464,
        language: 'English',
        description: 'A Handbook of Agile Software Craftsmanship',
        location: 'Section B, Shelf 1',
        condition: 'Excellent',
        status: 'available',
        borrow_count: 0
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt, David Thomas',
        isbn: '978-0-201-61622-4',
        category: 'Technology',
        publication_date: new Date('1999-10-30'),
        publisher: 'Addison-Wesley',
        pages: 352,
        language: 'English',
        description: 'Your Journey to Mastery',
        location: 'Section B, Shelf 2',
        condition: 'Good',
        status: 'available',
        borrow_count: 0
      },
      {
        title: 'Sapiens: Une brève histoire de l\'humanité',
        author: 'Yuval Noah Harari',
        isbn: '978-2-226-25701-7',
        category: 'History',
        publication_date: new Date('2011-01-01'),
        publisher: 'Albin Michel',
        pages: 512,
        language: 'French',
        description: 'Une exploration de l\'histoire de l\'humanité depuis l\'âge de pierre jusqu\'à nos jours.',
        location: 'Section C, Shelf 1',
        condition: 'Excellent',
        status: 'available',
        borrow_count: 0
      },
      {
        title: 'Steve Jobs',
        author: 'Walter Isaacson',
        isbn: '978-1-4516-4853-9',
        category: 'Biography',
        publication_date: new Date('2011-10-24'),
        publisher: 'Simon & Schuster',
        pages: 656,
        language: 'English',
        description: 'The Exclusive Biography',
        location: 'Section C, Shelf 2',
        condition: 'Good',
        status: 'available',
        borrow_count: 0
      }
    ];
    
    for (const book of books) {
      await Book.findOneAndUpdate(
        { isbn: book.isbn },
        book,
        { upsert: true, new: true }
      );
      console.log(`✅ Book inserted: ${book.title}`);
    }
    
    // Insert borrowers
    console.log('👥 Inserting borrowers...');
    const borrowers = [
      {
        name: 'Marie Dubois',
        email: 'marie.dubois@email.com',
        phone: '+33 1 23 45 67 89',
        address: '15 Rue de la République, 75001 Paris, France',
        status: 'active'
      },
      {
        name: 'Jean Martin',
        email: 'jean.martin@email.com',
        phone: '+33 1 98 76 54 32',
        address: '42 Avenue des Champs-Élysées, 75008 Paris, France',
        status: 'active'
      },
      {
        name: 'Sophie Bernard',
        email: 'sophie.bernard@email.com',
        phone: '+33 1 11 22 33 44',
        address: '8 Boulevard Saint-Germain, 75005 Paris, France',
        status: 'active'
      }
    ];
    
    for (const borrower of borrowers) {
      await Borrower.findOneAndUpdate(
        { email: borrower.email },
        borrower,
        { upsert: true, new: true }
      );
      console.log(`✅ Borrower inserted: ${borrower.name}`);
    }
    
    console.log('🎉 Test data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error inserting test data:', error);
    process.exit(1);
  }
};

// Run if executed directly
if (require.main === module) {
  insertTestData();
}

module.exports = { insertTestData };
