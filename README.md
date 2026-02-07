# Library Manager - Full Stack Application

A comprehensive library management system built with React, Node.js, Express, and MongoDB. This application provides complete functionality for managing books, borrowers, transactions, and generating reports.

## Project Overview

Library Manager is a full-stack web application designed to streamline library operations. It features a modern React frontend with a RESTful API backend, MongoDB database, and comprehensive documentation via Swagger/OpenAPI.

## Features

### Core Functionality

- **Book Catalog Management**: Add, edit, delete, and search books with advanced filtering
- **Borrower Management**: Complete CRUD operations for library members
- **Lending Process**: Streamlined book lending with due date tracking
- **Return Processing**: Handle book returns with fine calculation
- **Overdue Tracking**: Automated overdue detection and management
- **Reports & Analytics**: Comprehensive reporting system with multiple report types
- **Dashboard**: Real-time metrics and activity monitoring

### Technical Features

- **RESTful API**: Fully documented with Swagger/OpenAPI 3.0
- **Responsive Design**: Mobile-first approach using Tailwind CSS (Flexbox/Grid)
- **Real-time Updates**: Live data synchronization
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern UI library with hooks and concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework (Flexbox/Grid for responsive design)
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form validation and management
- **Recharts** - Data visualization for reports

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Mongoose** - MongoDB object modeling
- **Swagger/OpenAPI** - API documentation

### Development Tools

- **ESLint** - Code linting
- **Nodemon** - Auto-restart for development
- **dotenv** - Environment variable management

##  Prerequisites

- **Node.js** (v14.x or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## bInstallation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd LibraryManager
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Configure Environment Variables

**Frontend** (`.env` in root):

```env
VITE_API_PORT=5000
```

**Backend** (`server/.env`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library-manager
```

For MongoDB Atlas:

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Add your IP address to Network Access
3. Create a database user
4. Copy the connection string to `MONGODB_URI`

### 4. Initialize Database (Optional)

```bash
cd server
npm run init-db        # Initialize database structure
npm run insert-test-data  # Add sample data
```

### 5. Start the Application

**Option A: Start Both Servers Together**

```bash
npm run start:dev
```

**Option B: Start Separately**

Terminal 1 - Backend:

```bash
cd server
npm start
# Server runs on http://localhost:5000
```

Terminal 2 - Frontend:

```bash
npm start
# App runs on http://localhost:5173
```

## 📁 Project Structure

```
LibraryManager/
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Button, Input, etc.)
│   │   └── ...               # Feature components
│   ├── pages/                 # Page components
│   │   ├── library-dashboard/
│   │   ├── book-catalog-management/
│   │   ├── book-lending-process/
│   │   ├── book-return-processing/
│   │   ├── overdue-books-dashboard/
│   │   └── library-reports-center/
│   ├── services/              # API service layer
│   │   └── api.js            # Axios configuration
│   ├── styles/                # Global styles
│   ├── Routes.jsx             # Application routing
│   └── App.jsx                # Root component
├── server/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── swagger.js        # API documentation
│   ├── models/                # Mongoose models
│   │   ├── Book.js
│   │   ├── Borrower.js
│   │   ├── Transaction.js
│   │   └── Category.js
│   ├── routes/                # API routes
│   │   ├── books.js
│   │   ├── borrowers.js
│   │   ├── transactions.js
│   │   └── reports.js
│   ├── scripts/               # Database scripts
│   └── server.js              # Express server
├── .env                       # Frontend environment variables
├── package.json               # Frontend dependencies
└── README.md                  # This file
```

## 🔌 API Documentation

### Swagger UI

Access interactive API documentation at:

- **Development**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **Via Frontend**: [http://localhost:5173/api-docs](http://localhost:5173/api-docs)

The API follows RESTful principles with proper HTTP methods:

- `GET` - Retrieve resources
- `POST` - Create resources
- `PUT` - Update resources
- `DELETE` - Delete resources

### Main Endpoints

#### Books

- `GET /api/books` - List books (with search, filter, pagination)
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book
- `GET /api/books/categories/list` - List categories

#### Borrowers

- `GET /api/borrowers` - List borrowers
- `GET /api/borrowers/:id` - Get borrower details
- `POST /api/borrowers` - Create borrower
- `PUT /api/borrowers/:id` - Update borrower
- `DELETE /api/borrowers/:id` - Delete borrower
- `GET /api/borrowers/:id/transactions` - Get borrower history

#### Transactions

- `GET /api/transactions` - List transactions
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions/lend` - Lend a book
- `POST /api/transactions/return` - Return a book
- `GET /api/transactions/overdue/list` - Get overdue books

#### Reports

- `GET /api/reports/dashboard-summary` - Dashboard metrics
- `GET /api/reports/inventory` - Inventory summary
- `GET /api/reports/books-by-category` - Books by category
- `GET /api/reports/popular-books` - Most borrowed books
- `GET /api/reports/borrower-activity` - Borrower statistics
- `GET /api/reports/overdue-summary` - Overdue summary
- `GET /api/reports/monthly-stats` - Monthly statistics

## UI/UX Features

### Responsive Design

- **Mobile-first approach** using Tailwind CSS
- **Flexbox** for flexible layouts
- **CSS Grid** for complex grid layouts
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)

### Accessibility

- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Color contrast compliance

### User Experience

- Loading states for async operations
- Error boundaries with user-friendly messages
- Form validation with real-time feedback
- Toast notifications for actions
- Modal dialogs for confirmations

## Code Quality

### Naming Conventions

- **Components**: PascalCase (e.g., `BookTable.jsx`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: Match component/function names

### Code Organization

- Separation of concerns (components, services, utilities)
- Reusable components in `components/ui/`
- Feature-based page organization
- Centralized API service layer

### Best Practices

- Consistent indentation (2 spaces)
- Meaningful variable names
- DRY (Don't Repeat Yourself) principle
- Error handling at appropriate levels
- Comments for complex logic

## Deployment

### Build for Production

```bash
# Build frontend
npm run build

# The build output will be in the `build/` directory
```

### Environment Setup

1. Set `NODE_ENV=production` in `server/.env`
2. Update `MONGODB_URI` with production database
3. Configure CORS for production domain
4. Set up environment variables on hosting platform

### Hosting Options

**Frontend**: 

- Vercel, Netlify, GitHub Pages
- Serve `build/` directory

**Backend**:

- Heroku, Railway, Render, DigitalOcean
- Ensure MongoDB Atlas connection
- Set environment variables

## 📊 Database Schema

### Collections

**Books**

- title, author, isbn, category
- status (available, borrowed, maintenance, lost)
- publication_date, publisher, pages
- location, condition, borrow_count

**Borrowers**

- name, email, phone, address
- status (active, inactive, suspended)
- membership_date

**Transactions**

- book_id (reference), borrower_id (reference)
- transaction_type (lend, return)
- transaction_date, due_date, return_date
- fine_amount, notes

**Categories**

- name, description

## Testing

### Manual Testing Checklist

- Add/Edit/Delete books
- Add/Edit/Delete borrowers
- Process lending transaction
- Process return transaction
- View overdue books
- Generate reports
- Search and filter functionality
- Responsive design on mobile/tablet/desktop

## Documentation Files

- `README.md` - This file (project overview and setup)
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `LIBRARY_MANAGEMENT_SYSTEM_SRS.md` - Software Requirements Specification
- `ENHANCED_SRS_DOCUMENT.md` - Enhanced SRS
- `TROUBLESHOOTING.md` - Common issues and solutions
- `server/README.md` - Backend-specific documentation
- `server/MONGODB_MIGRATION.md` - Database migration guide

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is part of an academic assignment.

## Author

Developed as a full-stack project demonstrating:

- RESTful API design and implementation
- Modern React frontend development
- MongoDB database integration
- Responsive UI/UX design
- API documentation with Swagger/OpenAPI

## Acknowledgments

- React and Vite for the frontend framework
- Tailwind CSS for styling
- MongoDB Atlas for database hosting
- Swagger UI Express for API documentation

---

**For detailed API documentation, visit**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs) (when server is running)

**For setup help, see**: `SETUP_INSTRUCTIONS.md`

**For troubleshooting, see**: `TROUBLESHOOTING.md`