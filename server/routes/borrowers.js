const express = require('express');
const Borrower = require('../models/Borrower');
const Transaction = require('../models/Transaction');

const router = express.Router();

// Get all borrowers
router.get('/', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const borrowers = await Borrower.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    res.json(borrowers.map(b => ({ ...b, id: b._id })));
  } catch (error) {
    console.error('Error fetching borrowers:', error);
    res.status(500).json({ error: 'Failed to fetch borrowers' });
  }
});

// GET /api/borrowers/:id - Get a specific borrower
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const borrower = await Borrower.findById(id);
    
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower not found' });
    }
    
    res.json(borrower);
  } catch (error) {
    console.error('Error fetching borrower:', error);
    res.status(500).json({ error: 'Failed to fetch borrower' });
  }
});

// Create borrower
router.post('/', async (req, res) => {
  try {
    const borrowerData = req.body;
    
    const borrower = new Borrower(borrowerData);
    const savedBorrower = await borrower.save();
    const result = savedBorrower.toObject ? savedBorrower.toObject() : savedBorrower;
    result.id = result._id;
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating borrower:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Borrower with this email already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create borrower' });
    }
  }
});

// Update borrower
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const borrower = await Borrower.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower not found' });
    }
    
    res.json(borrower);
  } catch (error) {
    console.error('Error updating borrower:', error);
    res.status(500).json({ error: 'Failed to update borrower' });
  }
});

// DELETE /api/borrowers/:id - Delete a borrower
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const borrower = await Borrower.findByIdAndDelete(id);
    
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower not found' });
    }
    
    res.json({ message: 'Borrower deleted successfully' });
  } catch (error) {
    console.error('Error deleting borrower:', error);
    res.status(500).json({ error: 'Failed to delete borrower' });
  }
});

// Get borrower transactions
router.get('/:id/transactions', async (req, res) => {
  try {
    const { id } = req.params;
    
    const transactions = await Transaction.find({ borrower_id: id })
      .populate('book_id', 'title author isbn')
      .sort({ transaction_date: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching borrower transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
