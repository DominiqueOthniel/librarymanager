const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  membership_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive', 'suspended']
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index pour les recherches
borrowerSchema.index({ name: 'text', email: 'text', phone: 'text' });
borrowerSchema.index({ email: 1 });
borrowerSchema.index({ status: 1 });

module.exports = mongoose.model('Borrower', borrowerSchema);
