# 🚀 Library Manager - Full Stack Application

Your Library Manager is now a **real application** with a local database! Here's how to get it running:

## 📋 Prerequisites
- Node.js installed on your system
- npm (comes with Node.js)

## 🛠️ Setup Instructions

### 1. Start the Backend Server

**Option A: Using Command Line**
```bash
# Navigate to the server directory
cd server

# Install dependencies (if not already done)
npm install

# Start the server
node server.js
```

**Option B: Using the Batch File**
- Double-click `start-backend.bat` in the root directory

### 2. Start the Frontend

**In a new terminal window:**
```bash
# Navigate to the root directory
cd C:\Users\Latitude\OneDrive\Desktop\LibraryManager

# Start the frontend
npm start
```

## 🌐 Access Your Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## ✅ What's Working

Your app now has:

### 🗄️ **Real Database**
- SQLite database with persistent storage
- Books, borrowers, transactions, and categories tables
- Sample data pre-loaded

### 🔌 **API Endpoints**
- **Books**: Full CRUD operations with search/filtering
- **Borrowers**: Member management
- **Transactions**: Lending and returning books
- **Reports**: Analytics and statistics
- **Overdue Tracking**: Automatic overdue detection

### 🎨 **Frontend Features**
- Real API integration (no more mock data!)
- Error handling and loading states
- Live data updates
- Search and filtering
- Bulk operations

## 🎯 **Test Your App**

1. **Add a Book**: Click "Add Book" and fill out the form
2. **Search Books**: Use the search bar to find books
3. **Filter by Category**: Select different categories
4. **View Details**: Click on any book to see full details
5. **Edit/Delete**: Use the action buttons on each book

## 🔧 **Troubleshooting**

### Backend Not Starting?
1. Make sure you're in the `server` directory
2. Run `npm install` to ensure dependencies are installed
3. Check if port 5000 is available
4. Look for error messages in the console

### Frontend Not Connecting?
1. Make sure the backend is running on port 5000
2. Check the browser console for API errors
3. Verify the API service is pointing to `http://localhost:5000/api`

### Database Issues?
1. The database is automatically created in `server/database/library.db`
2. Sample data is loaded automatically
3. If you need to reset, delete the database file and restart

## 📊 **Sample Data Included**

Your database comes pre-loaded with:
- 6 sample books (To Kill a Mockingbird, 1984, etc.)
- 3 sample borrowers
- Book categories (Fiction, Biography, Science, etc.)

## 🚀 **Next Steps**

Your Library Manager is now production-ready! You can:
- Add more books and borrowers
- Process real lending transactions
- Generate reports
- Deploy to a cloud service
- Add more features like email notifications

**Enjoy your real Library Manager application!** 🎉



