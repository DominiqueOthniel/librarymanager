const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  publication_date: {
    type: Date
  },
  publisher: {
    type: String,
    trim: true
  },
  pages: {
    type: Number
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  description: {
    type: String
  },
  location: {
    type: String,
    trim: true
  },
  condition: {
    type: String,
    default: 'Good',
    enum: ['Excellent', 'Good', 'Fair', 'Poor']
  },
  status: {
    type: String,
    default: 'available',
    enum: ['available', 'borrowed', 'maintenance', 'lost']
  },
  date_added: {
    type: Date,
    default: Date.now
  },
  borrow_count: {
    type: Number,
    default: 0
  },
  cover_image: {
    type: String
  }
}, {
  timestamps: true
});

// Index pour les recherches
bookSchema.index({ title: 'text', author: 'text', isbn: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ status: 1 });

module.exports = mongoose.model('Book', bookSchema);
