const express = require('express');
const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const Borrower = require('../models/Borrower');
const Category = require('../models/Category');

const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
  try {
    const { search, category, status, page = 1, limit = 50 } = req.query;
    
    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;
    
    // Get books with pagination
    const books = await Book.find(query)
      .sort({ title: 1 })
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    // Get borrower info for borrowed books
    const booksWithBorrowerInfo = await Promise.all(
      books.map(async (book) => {
        book.id = book._id;
        if (book.status === 'borrowed') {
          const activeTransaction = await Transaction.findOne({
            book_id: book._id,
            transaction_type: 'lend',
            return_date: null
          }).populate('borrower_id', 'name email');
          
          if (activeTransaction) {
            book.borrower_info = {
              name: activeTransaction.borrower_id.name,
              email: activeTransaction.borrower_id.email,
              dueDate: activeTransaction.due_date
            };
          }
        }
        return book;
      })
    );
    
    res.json(booksWithBorrowerInfo);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get book by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findById(id).lean();
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    book.id = book._id;
    
    // Get borrower info if borrowed
    if (book.status === 'borrowed') {
      const activeTransaction = await Transaction.findOne({
        book_id: id,
        transaction_type: 'lend',
        return_date: null
      }).populate('borrower_id', 'name email');
      
      if (activeTransaction) {
        book.borrower_info = {
          name: activeTransaction.borrower_id.name,
          email: activeTransaction.borrower_id.email,
          dueDate: activeTransaction.due_date
        };
      }
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// Create book
router.post('/', async (req, res) => {
  try {
    const bookData = req.body;
    
    const book = new Book(bookData);
    const savedBook = await book.save();
    
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error creating book:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Book with this ISBN already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create book' });
    }
  }
});

// Update book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const book = await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByIdAndDelete(id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
