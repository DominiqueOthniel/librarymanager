const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrower_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Borrower',
    required: true
  },
  transaction_type: {
    type: String,
    required: true,
    enum: ['lend', 'return']
  },
  transaction_date: {
    type: Date,
    default: Date.now
  },
  due_date: {
    type: Date
  },
  return_date: {
    type: Date
  },
  fine_amount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index pour les recherches
transactionSchema.index({ book_id: 1 });
transactionSchema.index({ borrower_id: 1 });
transactionSchema.index({ transaction_type: 1 });
transactionSchema.index({ transaction_date: -1 });
transactionSchema.index({ due_date: 1 });
transactionSchema.index({ return_date: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
