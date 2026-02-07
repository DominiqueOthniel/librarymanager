import axios from 'axios';

// Prefer environment variable (Vite) or fall back to Vite dev proxy (/api)
const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || '/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Books API
export const booksAPI = {
  // Get all books with optional filtering
  getAll: (params = {}) => api.get('/books', { params }),
  
  // Get specific book
  getById: (id) => api.get(`/books/${id}`),
  
  // Create new book
  create: (bookData) => api.post('/books', bookData),
  
  // Update book
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  
  // Delete book
  delete: (id) => api.delete(`/books/${id}`),
  
  // Get categories
  getCategories: () => api.get('/books/categories/list'),
};

// Borrowers API
export const borrowersAPI = {
  // Get all borrowers
  getAll: (params = {}) => api.get('/borrowers', { params }),
  
  // Get specific borrower
  getById: (id) => api.get(`/borrowers/${id}`),
  
  // Create new borrower
  create: (borrowerData) => api.post('/borrowers', borrowerData),
  
  // Update borrower
  update: (id, borrowerData) => api.put(`/borrowers/${id}`, borrowerData),
  
  // Delete borrower
  delete: (id) => api.delete(`/borrowers/${id}`),
  
  // Get borrower transactions
  getTransactions: (id) => api.get(`/borrowers/${id}/transactions`),
};

// Transactions API
export const transactionsAPI = {
  // Get all transactions
  getAll: (params = {}) => api.get('/transactions', { params }),
  
  // Get specific transaction
  getById: (id) => api.get(`/transactions/${id}`),
  
  // Lend a book
  lend: (transactionData) => api.post('/transactions/lend', transactionData),
  
  // Return a book
  return: (transactionData) => api.post('/transactions/return', transactionData),
  
  // Get overdue books
  getOverdue: () => api.get('/transactions/overdue/list'),
};

// Reports API
export const reportsAPI = {
  // Get inventory summary
  getInventory: () => api.get('/reports/inventory'),
  
  // Get books by category
  getBooksByCategory: () => api.get('/reports/books-by-category'),
  
  // Get popular books
  getPopularBooks: (limit = 10) => api.get('/reports/popular-books', { params: { limit } }),
  
  // Get borrower activity
  getBorrowerActivity: () => api.get('/reports/borrower-activity'),
  
  // Get overdue summary
  getOverdueSummary: () => api.get('/reports/overdue-summary'),
  
  // Get monthly stats
  getMonthlyStats: (months = 12) => api.get('/reports/monthly-stats', { params: { months } }),
  
  // Get dashboard summary
  getDashboardSummary: () => api.get('/reports/dashboard-summary'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;



