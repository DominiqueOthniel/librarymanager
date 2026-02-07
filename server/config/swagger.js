// Swagger/OpenAPI configuration
const swaggerUi = require('swagger-ui-express');

const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Library Manager API',
      version: '1.0.0',
      description: 'REST API for library book tracking, borrowers, transactions and reports',
      contact: { name: 'Library Manager' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development server' },
      { url: 'http://localhost:5001', description: 'Development server (alt port)' },
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'MongoDB ObjectId' },
            id: { type: 'string', description: 'Alias for _id' },
            title: { type: 'string', required: true },
            author: { type: 'string', required: true },
            isbn: { type: 'string' },
            category: { type: 'string' },
            publication_date: { type: 'string', format: 'date-time' },
            publisher: { type: 'string' },
            pages: { type: 'integer' },
            language: { type: 'string', default: 'English' },
            description: { type: 'string' },
            location: { type: 'string' },
            condition: { type: 'string', enum: ['Excellent', 'Good', 'Fair', 'Poor'] },
            status: { type: 'string', enum: ['available', 'borrowed', 'maintenance', 'lost'], default: 'available' },
            borrow_count: { type: 'integer', default: 0 },
          },
        },
        Borrower: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            id: { type: 'string' },
            name: { type: 'string', required: true },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            status: { type: 'string', enum: ['active', 'inactive', 'suspended'], default: 'active' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            id: { type: 'string' },
            book_id: { type: 'string' },
            borrower_id: { type: 'string' },
            transaction_type: { type: 'string', enum: ['lend', 'return'] },
            transaction_date: { type: 'string', format: 'date-time' },
            due_date: { type: 'string', format: 'date-time' },
            return_date: { type: 'string', format: 'date-time', nullable: true },
            fine_amount: { type: 'number', default: 0 },
          },
        },
        LendRequest: {
          type: 'object',
          required: ['book_id', 'borrower_id', 'due_date'],
          properties: {
            book_id: { type: 'string', description: 'MongoDB ObjectId of the book' },
            borrower_id: { type: 'string', description: 'MongoDB ObjectId of the borrower' },
            due_date: { type: 'string', format: 'date-time', description: 'ISO date when book is due' },
            notes: { type: 'string' },
          },
        },
        ReturnRequest: {
          type: 'object',
          required: ['transaction_id'],
          properties: {
            transaction_id: { type: 'string', description: 'MongoDB ObjectId of the lending transaction' },
            fine_amount: { type: 'number', default: 0 },
            notes: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Books', description: 'Book catalog operations' },
      { name: 'Borrowers', description: 'Borrower management' },
      { name: 'Transactions', description: 'Lending and returns' },
      { name: 'Reports', description: 'Analytics and reports' },
      { name: 'Health', description: 'API health check' },
    ],
    paths: {
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: { 200: { description: 'API and database status' } },
        },
      },
      '/api/books': {
        get: {
          tags: ['Books'],
          summary: 'List books',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search title, author, ISBN' },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['available', 'borrowed', 'maintenance', 'lost'] } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          ],
          responses: { 200: { description: 'Array of books' } },
        },
        post: {
          tags: ['Books'],
          summary: 'Create book',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
          responses: { 201: { description: 'Created book' }, 400: { description: 'Validation error' } },
        },
      },
      '/api/books/categories/list': {
        get: {
          tags: ['Books'],
          summary: 'List categories',
          responses: { 200: { description: 'Array of categories' } },
        },
      },
      '/api/books/{id}': {
        get: {
          tags: ['Books'],
          summary: 'Get book by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Book' }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Books'],
          summary: 'Update book',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Book' } } } },
          responses: { 200: { description: 'Updated book' }, 404: { description: 'Not found' } },
        },
        delete: {
          tags: ['Books'],
          summary: 'Delete book',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
        },
      },
      '/api/borrowers': {
        get: {
          tags: ['Borrowers'],
          summary: 'List borrowers',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'inactive', 'suspended'] } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          ],
          responses: { 200: { description: 'Array of borrowers' } },
        },
        post: {
          tags: ['Borrowers'],
          summary: 'Create borrower',
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Borrower' } } } },
          responses: { 201: { description: 'Created borrower' }, 400: { description: 'Validation error' } },
        },
      },
      '/api/borrowers/{id}': {
        get: {
          tags: ['Borrowers'],
          summary: 'Get borrower by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Borrower' }, 404: { description: 'Not found' } },
        },
        put: {
          tags: ['Borrowers'],
          summary: 'Update borrower',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Borrower' } } } },
          responses: { 200: { description: 'Updated borrower' }, 404: { description: 'Not found' } },
        },
        delete: {
          tags: ['Borrowers'],
          summary: 'Delete borrower',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
        },
      },
      '/api/borrowers/{id}/transactions': {
        get: {
          tags: ['Borrowers'],
          summary: 'Get borrower transactions',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Array of transactions' } },
        },
      },
      '/api/transactions': {
        get: {
          tags: ['Transactions'],
          summary: 'List transactions',
          parameters: [
            { name: 'type', in: 'query', schema: { type: 'string', enum: ['lend', 'return'] } },
            { name: 'status', in: 'query', schema: { type: 'string', enum: ['active', 'borrowed', 'returned'] } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          ],
          responses: { 200: { description: 'Array of transactions' } },
        },
      },
      '/api/transactions/overdue/list': {
        get: {
          tags: ['Transactions'],
          summary: 'List overdue books',
          responses: { 200: { description: 'Array of overdue transactions with book and borrower info' } },
        },
      },
      '/api/transactions/{id}': {
        get: {
          tags: ['Transactions'],
          summary: 'Get transaction by ID',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Transaction' }, 404: { description: 'Not found' } },
        },
      },
      '/api/transactions/lend': {
        post: {
          tags: ['Transactions'],
          summary: 'Lend a book',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LendRequest' } },
          },
          responses: { 201: { description: 'Lending recorded' }, 400: { description: 'Invalid request' }, 404: { description: 'Book or borrower not found' } },
        },
      },
      '/api/transactions/return': {
        post: {
          tags: ['Transactions'],
          summary: 'Return a book',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ReturnRequest' } } },
          },
          responses: { 200: { description: 'Return recorded' }, 400: { description: 'Invalid request' }, 404: { description: 'Transaction not found' } },
        },
      },
      '/api/reports/dashboard-summary': {
        get: {
          tags: ['Reports'],
          summary: 'Dashboard summary',
          responses: { 200: { description: 'Inventory, borrowers, overdue, recent activity' } },
        },
      },
      '/api/reports/inventory': {
        get: {
          tags: ['Reports'],
          summary: 'Inventory report',
          responses: { 200: { description: 'Book counts by status' } },
        },
      },
      '/api/reports/books-by-category': {
        get: {
          tags: ['Reports'],
          summary: 'Books by category',
          responses: { 200: { description: 'Book counts per category' } },
        },
      },
      '/api/reports/popular-books': {
        get: {
          tags: ['Reports'],
          summary: 'Popular books',
          parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }],
          responses: { 200: { description: 'Most borrowed books' } },
        },
      },
      '/api/reports/borrower-activity': {
        get: {
          tags: ['Reports'],
          summary: 'Borrower activity',
          responses: { 200: { description: 'Borrower statistics' } },
        },
      },
      '/api/reports/overdue-summary': {
        get: {
          tags: ['Reports'],
          summary: 'Overdue summary',
          responses: { 200: { description: 'Overdue counts and stats' } },
        },
      },
      '/api/reports/monthly-stats': {
        get: {
          tags: ['Reports'],
          summary: 'Monthly stats',
          parameters: [{ name: 'months', in: 'query', schema: { type: 'integer', default: 12 } }],
          responses: { 200: { description: 'Monthly lending/return stats' } },
        },
      },
    },
  },
};

const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Library Manager API',
};

module.exports = { spec, swaggerUi, swaggerUiOptions };
