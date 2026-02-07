const express = require('express');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Borrower = require('../models/Borrower');
const mongoose = require('mongoose');

const router = express.Router();

// Get all transactions
router.get('/', async (req, res) => {
  try {
    const { type, status, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (type) {
      query.transaction_type = type;
    }
    
    if (status === 'active' || status === 'borrowed') {
      query.return_date = null;
      query.transaction_type = 'lend';
    } else if (status === 'returned') {
      query.return_date = { $ne: null };
    }
    
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;
    
    const transactions = await Transaction.find(query)
      .populate('book_id', 'title author isbn')
      .populate('borrower_id', 'name email')
      .sort({ transaction_date: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    // Format response to match expected structure
    const formattedTransactions = transactions.map(t => ({
      ...t,
      id: t._id,
      title: t.book_id?.title,
      author: t.book_id?.author,
      isbn: t.book_id?.isbn,
      borrower_name: t.borrower_id?.name,
      borrower_email: t.borrower_id?.email
    }));
    
    res.json(formattedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET /api/transactions/overdue/list - Get overdue books (must be before /:id)
router.get('/overdue/list', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTransactions = await Transaction.find({
      transaction_type: 'lend',
      return_date: null,
      due_date: { $lt: today }
    })
      .populate('book_id', 'title author isbn category')
      .populate('borrower_id', 'name email phone')
      .sort({ due_date: 1 })
      .lean();
    
    const formattedOverdue = overdueTransactions.map(t => {
      const dueDate = new Date(t.due_date);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const overdueDays = Math.floor((todayDate - dueDate) / (1000 * 60 * 60 * 24));
      
      return {
        ...t,
        id: t._id,
        title: t.book_id?.title,
        author: t.book_id?.author,
        isbn: t.book_id?.isbn,
        category: t.book_id?.category,
        borrower_name: t.borrower_id?.name,
        borrower_email: t.borrower_id?.email,
        borrower_phone: t.borrower_id?.phone,
        overdue_days: overdueDays
      };
    });
    
    res.json(formattedOverdue);
  } catch (error) {
    console.error('Error fetching overdue books:', error);
    res.status(500).json({ error: 'Failed to fetch overdue books' });
  }
});

// Get transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findById(id)
      .populate('book_id', 'title author isbn')
      .populate('borrower_id', 'name email')
      .lean();
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    // Format response
    const formattedTransaction = {
      ...transaction,
      title: transaction.book_id?.title,
      author: transaction.book_id?.author,
      isbn: transaction.book_id?.isbn,
      borrower_name: transaction.borrower_id?.name,
      borrower_email: transaction.borrower_id?.email
    };
    
    res.json(formattedTransaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Lend book
router.post('/lend', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { book_id, borrower_id, due_date, notes } = req.body;
    
    if (!book_id || !borrower_id || !due_date) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Book ID, borrower ID, and due date are required' });
    }
    
    // Check if book exists and is available
    const book = await Book.findById(book_id).session(session);
    if (!book) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Book not found' });
    }
    
    if (book.status !== 'available') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Book is not available for lending' });
    }
    
    // Check if borrower exists and is active
    const borrower = await Borrower.findById(borrower_id).session(session);
    if (!borrower) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Borrower not found' });
    }
    
    if (borrower.status !== 'active') {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Borrower is not active' });
    }
    
    // Create the lending transaction
    const transaction = new Transaction({
      book_id,
      borrower_id,
      transaction_type: 'lend',
      due_date: new Date(due_date),
      notes
    });
    
    await transaction.save({ session });
    
    // Update book status to borrowed and increment borrow count
    book.status = 'borrowed';
    book.borrow_count = (book.borrow_count || 0) + 1;
    await book.save({ session });
    
    await session.commitTransaction();
    
    res.status(201).json({
      id: transaction._id,
      message: 'Book lent successfully',
      transaction_date: transaction.transaction_date,
      due_date: transaction.due_date
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating lending transaction:', error);
    res.status(500).json({ error: 'Failed to create lending transaction' });
  } finally {
    session.endSession();
  }
});

// Return book
router.post('/return', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { transaction_id, fine_amount, notes } = req.body;
    
    if (!transaction_id) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Transaction ID is required' });
    }
    
    // Get the lending transaction
    const transaction = await Transaction.findOne({
      _id: transaction_id,
      transaction_type: 'lend',
      return_date: null
    }).session(session);
    
    if (!transaction) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Active lending transaction not found' });
    }
    
    // Update the transaction with return information
    transaction.return_date = new Date();
    transaction.fine_amount = fine_amount || 0;
    if (notes) transaction.notes = notes;
    await transaction.save({ session });
    
    // Update book status back to available
    const book = await Book.findById(transaction.book_id).session(session);
    if (book) {
      book.status = 'available';
      await book.save({ session });
    }
    
    await session.commitTransaction();
    
    res.json({
      message: 'Book returned successfully',
      return_date: transaction.return_date,
      fine_amount: transaction.fine_amount
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error processing return:', error);
    res.status(500).json({ error: 'Failed to process return' });
  } finally {
    session.endSession();
  }
});

module.exports = router;
