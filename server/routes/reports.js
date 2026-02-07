const express = require('express');
const Book = require('../models/Book');
const Borrower = require('../models/Borrower');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

const router = express.Router();

// GET /api/reports/inventory - Get inventory summary
router.get('/inventory', async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $group: {
          _id: null,
          total_books: { $sum: 1 },
          available_books: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          },
          borrowed_books: {
            $sum: { $cond: [{ $eq: ['$status', 'borrowed'] }, 1, 0] }
          },
          maintenance_books: {
            $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const categoryCount = await Category.countDocuments();
    
    const result = stats[0] || {
      total_books: 0,
      available_books: 0,
      borrowed_books: 0,
      maintenance_books: 0
    };
    
    result.total_categories = categoryCount;
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching inventory report:', error);
    res.status(500).json({ error: 'Failed to fetch inventory report' });
  }
});

// Get books by category
router.get('/books-by-category', async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          total_books: { $sum: 1 },
          available: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          },
          borrowed: {
            $sum: { $cond: [{ $eq: ['$status', 'borrowed'] }, 1, 0] }
          },
          maintenance: {
            $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          total_books: 1,
          available: 1,
          borrowed: 1,
          maintenance: 1,
          _id: 0
        }
      },
      { $sort: { total_books: -1 } }
    ]);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching books by category report:', error);
    res.status(500).json({ error: 'Failed to fetch books by category report' });
  }
});

// Get popular books
router.get('/popular-books', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const books = await Book.find()
      .select('title author category borrow_count status')
      .sort({ borrow_count: -1 })
      .limit(parseInt(limit));
    
    res.json(books);
  } catch (error) {
    console.error('Error fetching popular books report:', error);
    res.status(500).json({ error: 'Failed to fetch popular books report' });
  }
});

// GET /api/reports/borrower-activity - Get borrower activity summary
router.get('/borrower-activity', async (req, res) => {
  try {
    const totalBorrowers = await Borrower.countDocuments();
    const activeBorrowers = await Borrower.countDocuments({ status: 'active' });
    
    const borrowersWithActiveLoans = await Transaction.distinct('borrower_id', {
      transaction_type: 'lend',
      return_date: null
    });
    
    const borrowersWithHistory = await Transaction.distinct('borrower_id', {
      transaction_type: 'lend',
      return_date: { $ne: null }
    });
    
    res.json({
      total_borrowers: totalBorrowers,
      active_borrowers: activeBorrowers,
      borrowers_with_active_loans: borrowersWithActiveLoans.length,
      borrowers_with_history: borrowersWithHistory.length
    });
  } catch (error) {
    console.error('Error fetching borrower activity report:', error);
    res.status(500).json({ error: 'Failed to fetch borrower activity report' });
  }
});

// Get overdue summary
router.get('/overdue-summary', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueTransactions = await Transaction.find({
      transaction_type: 'lend',
      return_date: null,
      due_date: { $lt: today }
    });
    
    const totalOverdue = overdueTransactions.length;
    
    let totalOverdueDays = 0;
    let overdue1Week = 0;
    let overdue1Month = 0;
    let overdueOverMonth = 0;
    
    overdueTransactions.forEach(t => {
      const dueDate = new Date(t.due_date);
      const overdueDays = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      totalOverdueDays += overdueDays;
      
      if (overdueDays <= 7) {
        overdue1Week++;
      } else if (overdueDays <= 30) {
        overdue1Month++;
      } else {
        overdueOverMonth++;
      }
    });
    
    const avgOverdueDays = totalOverdue > 0 ? totalOverdueDays / totalOverdue : 0;
    
    res.json({
      total_overdue: totalOverdue,
      avg_overdue_days: avgOverdueDays,
      overdue_1_week: overdue1Week,
      overdue_1_month: overdue1Month,
      overdue_over_month: overdueOverMonth
    });
  } catch (error) {
    console.error('Error fetching overdue summary:', error);
    res.status(500).json({ error: 'Failed to fetch overdue summary' });
  }
});

// Get monthly stats
router.get('/monthly-stats', async (req, res) => {
  try {
    const { months = 12 } = req.query;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months));
    
    const stats = await Transaction.aggregate([
      {
        $match: {
          transaction_date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$transaction_date' },
            month: { $month: '$transaction_date' }
          },
          total_transactions: { $sum: 1 },
          books_lent: {
            $sum: { $cond: [{ $eq: ['$transaction_type', 'lend'] }, 1, 0] }
          },
          books_returned: {
            $sum: { $cond: [{ $eq: ['$transaction_type', 'return'] }, 1, 0] }
          },
          total_fines: { $sum: '$fine_amount' }
        }
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              { $cond: [{ $lt: ['$_id.month', 10] }, '0', ''] },
              { $toString: '$_id.month' }
            ]
          },
          total_transactions: 1,
          books_lent: 1,
          books_returned: 1,
          total_fines: 1,
          _id: 0
        }
      },
      { $sort: { month: -1 } }
    ]);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({ error: 'Failed to fetch monthly stats' });
  }
});

// Get dashboard summary
router.get('/dashboard-summary', async (req, res) => {
  try {
    // Inventory stats
    const inventoryStats = await Book.aggregate([
      {
        $group: {
          _id: null,
          total_books: { $sum: 1 },
          available_books: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          },
          borrowed_books: {
            $sum: { $cond: [{ $eq: ['$status', 'borrowed'] }, 1, 0] }
          },
          maintenance_books: {
            $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Borrowers stats
    const borrowersStats = await Borrower.aggregate([
      {
        $group: {
          _id: null,
          total_borrowers: { $sum: 1 },
          active_borrowers: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      }
    ]);
    
    // Overdue count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const overdueCount = await Transaction.countDocuments({
      transaction_type: 'lend',
      return_date: null,
      due_date: { $lt: today }
    });
    
    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTransactions = await Transaction.countDocuments({
      transaction_date: { $gte: sevenDaysAgo }
    });
    
    res.json({
      inventory: inventoryStats[0] || {
        total_books: 0,
        available_books: 0,
        borrowed_books: 0,
        maintenance_books: 0
      },
      borrowers: borrowersStats[0] || {
        total_borrowers: 0,
        active_borrowers: 0
      },
      overdue: {
        overdue_count: overdueCount
      },
      recentActivity: {
        recent_transactions: recentTransactions
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

module.exports = router;
