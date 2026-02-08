const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const isConnected = connectDB.isConnected;
const { spec, swaggerUi, swaggerUiOptions } = require('./config/swagger');

const app = express();

// Middlewares
// CORS configuration - allow requests from Netlify and other origins
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://librarynager.netlify.app',
      'https://*.netlify.app'
    ];
    
    // Check if origin is allowed
    if (allowedOrigins.some(allowed => origin.includes(allowed.replace('*', '')))) {
      callback(null, true);
    } else {
      // In production, you might want to be more strict
      // For now, allow all origins (you can restrict this later)
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '1mb' }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(spec, swaggerUiOptions));

// API info endpoint
app.get(['/api', '/api/'], (req, res) => {
  res.json({
    name: 'Library Manager API',
    version: '1.0',
    docs: '/api-docs',
    endpoints: {
      health: '/api/health',
      books: '/api/books',
      borrowers: '/api/borrowers',
      transactions: '/api/transactions',
      reports: '/api/reports'
    }
  });
});

// API Routes (must be before static file serving)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isConnected() ? 'connected' : 'connecting',
  });
});

// Connect to MongoDB (non-blocking, retries in background)
connectDB();

// Routes
const booksRouter = require('./routes/books');
const borrowersRouter = require('./routes/borrowers');
const transactionsRouter = require('./routes/transactions');
const reportsRouter = require('./routes/reports');

app.use('/api/books', booksRouter);
app.use('/api/borrowers', borrowersRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/reports', reportsRouter);

// Serve static files - in production serve built React app, in dev serve public assets
const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  // Serve built React app
  const buildDir = path.join(__dirname, '..', 'build');
  
  // Custom static file handler with correct MIME types
  app.use(express.static(buildDir, {
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.mjs') {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (ext === '.js') {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (ext === '.json') {
        res.setHeader('Content-Type', 'application/json');
      } else if (ext === '.css') {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));
  
  // Fallback to index.html for React Router (must be last)
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
  });
} else {
  // In development, serve public assets and info message
  const publicDir = path.join(__dirname, '..', 'public');
  app.use(express.static(publicDir));
  
  // Root info route for dev mode
  app.get('/', (req, res) => {
    const port = process.env.PORT || 5000;
    res.type('text/plain').send(`Library Manager API is running.\nBackend: http://localhost:${port}/api\nAPI Docs (Swagger): http://localhost:${port}/api-docs\nFrontend: http://localhost:5173 (run npm start)`);
  });
}

// Start server with automatic port fallback if in use
function startServer(preferredPort, attempt) {
  const portToUse = preferredPort;
  const host = process.env.HOST || '0.0.0.0'; // Listen on all interfaces (required for Render)
  const server = app
    .listen(portToUse, host, () => {
      console.log(`✅ Library Manager backend running on port ${portToUse}`);
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    })
    .on('error', (err) => {
      if (err && err.code === 'EADDRINUSE' && attempt < 5) {
        const nextPort = portToUse + 1;
        console.warn(`Port ${portToUse} occupé, tentative sur ${nextPort}...`);
        startServer(nextPort, attempt + 1);
      } else {
        console.error('Erreur au démarrage du serveur:', err);
        process.exit(1);
      }
    });
  return server;
}

// Global error handler for unhandled route errors
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err?.message });
});

const initialPort = Number(process.env.PORT) || 5000;
startServer(initialPort, 0);


