import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import BookSearchPanel from './components/BookSearchPanel';
import BorrowerDetailsPanel from './components/BorrowerDetailsPanel';
import TransactionSummary from './components/TransactionSummary';
import SuccessModal from './components/SuccessModal';
import Icon from '../../components/AppIcon';
import { reportsAPI, transactionsAPI, booksAPI, borrowersAPI } from '../../services/api';

const BookLendingProcess = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowerData, setBorrowerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    membershipId: '',
    dueDate: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  
  // Statistics state
  const [stats, setStats] = useState({
    availableBooks: 0,
    activeBorrowers: 0,
    dueToday: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Load statistics data
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        
        // Fetch dashboard summary for available books and active borrowers
        const dashboardResponse = await reportsAPI.getDashboardSummary();
        const dashboardData = dashboardResponse.data || dashboardResponse;
        console.log('Dashboard data for lending stats:', dashboardData);
        
        // Fetch transactions due today
        const today = new Date().toISOString().split('T')[0];
        const dueTodayResponse = await transactionsAPI.getAll({ 
          due_date: today,
          status: 'borrowed'
        });
        const dueTodayData = dueTodayResponse.data || dueTodayResponse;
        console.log('Due today data:', dueTodayData);
        
        setStats({
          availableBooks: dashboardData?.inventory?.available_books || 0,
          activeBorrowers: dashboardData?.borrowers?.active_borrowers || 0,
          dueToday: Array.isArray(dueTodayData) ? dueTodayData.length : 0
        });
      } catch (error) {
        console.error('Error loading lending statistics:', error);
        setStatsError(error.message || 'Failed to load statistics');
        // Set fallback values
        setStats({
          availableBooks: 0,
          activeBorrowers: 0,
          dueToday: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleBorrowerChange = (data) => {
    setBorrowerData(data);
  };

  const handleProcessLending = async () => {
    if (!selectedBook || !borrowerData?.name || !borrowerData?.email || !borrowerData?.phone || !borrowerData?.dueDate) {
      return;
    }

    setIsProcessing(true);

    try {
      console.log('Processing lending transaction...', { selectedBook, borrowerData });
      
      // First, create or find the borrower
      let borrower;
      try {
        // Try to find existing borrower by email (using search parameter)
        const borrowersResponse = await borrowersAPI.getAll({ search: borrowerData.email });
        const existingBorrowers = borrowersResponse.data || borrowersResponse;
        if (Array.isArray(existingBorrowers) && existingBorrowers.length > 0) {
          // Filter by exact email match since search does LIKE
          const exactMatch = existingBorrowers.find(b => b.email === borrowerData.email);
          if (exactMatch) {
            borrower = exactMatch;
            console.log('Found existing borrower:', borrower);
          } else {
            // Create new borrower if no exact match
            const newBorrowerResponse = await borrowersAPI.create({
              name: borrowerData.name,
              email: borrowerData.email,
              phone: borrowerData.phone,
              address: borrowerData.address || '',
              notes: borrowerData.membershipId ? `Membership ID: ${borrowerData.membershipId}` : ''
            });
            borrower = newBorrowerResponse.data || newBorrowerResponse;
            console.log('Created new borrower:', borrower);
          }
        } else {
          // Create new borrower
          const newBorrowerResponse = await borrowersAPI.create({
            name: borrowerData.name,
            email: borrowerData.email,
            phone: borrowerData.phone,
            address: borrowerData.address || '',
            notes: borrowerData.membershipId ? `Membership ID: ${borrowerData.membershipId}` : ''
          });
          borrower = newBorrowerResponse.data || newBorrowerResponse;
          console.log('Created new borrower:', borrower);
        }
      } catch (borrowerError) {
        console.error('Error handling borrower:', borrowerError);
        throw new Error('Failed to process borrower information: ' + (borrowerError.response?.data?.error || borrowerError.message));
      }

      // Create the lending transaction (use _id or id for MongoDB)
      const bookId = selectedBook._id || selectedBook.id;
      const borrowerId = borrower._id || borrower.id;
      if (!bookId || !borrowerId) {
        throw new Error('Missing book or borrower ID');
      }
      const transactionData = {
        book_id: bookId,
        borrower_id: borrowerId,
        due_date: borrowerData.dueDate,
        notes: borrowerData.notes || ''
      };

      console.log('Creating transaction with data:', transactionData);
      const transactionResponse = await transactionsAPI.lend(transactionData);
      const transaction = transactionResponse.data || transactionResponse;
      console.log('Transaction created successfully:', transaction);

      // Update the book status to borrowed
      try {
        await booksAPI.update(selectedBook.id, { status: 'borrowed' });
        console.log('Book status updated to borrowed');
      } catch (bookUpdateError) {
        console.error('Error updating book status:', bookUpdateError);
        // Don't fail the transaction for this, just log it
      }

      // Prepare success data
      const successData = {
        id: transaction.id,
        book: selectedBook,
        borrower: borrower,
        checkoutDate: new Date().toISOString(),
        dueDate: borrowerData.dueDate,
        status: 'active',
        transactionId: transaction.id
      };

      setTransactionData(successData);
      setShowSuccessModal(true);
      
      // Clear form after successful transaction
      setSelectedBook(null);
      setBorrowerData({
        name: '',
        email: '',
        phone: '',
        address: '',
        membershipId: '',
        dueDate: '',
        notes: ''
      });

      // Reload statistics to reflect the new transaction
      const loadStats = async () => {
        try {
          const dashboardResponse = await reportsAPI.getDashboardSummary();
          const dashboardData = dashboardResponse.data || dashboardResponse;
          const today = new Date().toISOString().split('T')[0];
          const dueTodayResponse = await transactionsAPI.getAll({ 
            due_date: today,
            status: 'borrowed'
          });
          const dueTodayData = dueTodayResponse.data || dueTodayResponse;
          
          setStats({
            availableBooks: dashboardData?.inventory?.available_books || 0,
            activeBorrowers: dashboardData?.borrowers?.active_borrowers || 0,
            dueToday: Array.isArray(dueTodayData) ? dueTodayData.length : 0
          });
        } catch (error) {
          console.error('Error reloading stats:', error);
        }
      };
      loadStats();

    } catch (error) {
      console.error('Error processing lending:', error);
      const errMsg = error.response?.data?.error || error.message || 'Unknown error occurred';
      alert(`Error processing lending: ${errMsg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearForm = () => {
    setSelectedBook(null);
    setBorrowerData({
      name: '',
      email: '',
      phone: '',
      address: '',
      membershipId: '',
      dueDate: '',
      notes: ''
    });
  };

  const handlePrintReceipt = () => {
    // Simulate printing receipt
    const printContent = `
      LIBRARY CHECKOUT RECEIPT
      ========================
      
      Transaction ID: TXN-${new Date()?.getFullYear()}-${String(Date.now())?.slice(-6)}
      Date: ${new Date()?.toLocaleDateString()}
      
      BOOK DETAILS:
      Title: ${selectedBook?.title || transactionData?.book?.title}
      Author: ${selectedBook?.author || transactionData?.book?.author}
      Book ID: ${selectedBook?.id || transactionData?.book?.id}
      
      BORROWER:
      Name: ${borrowerData?.name || transactionData?.borrower?.name}
      Email: ${borrowerData?.email || transactionData?.borrower?.email}
      Phone: ${borrowerData?.phone || transactionData?.borrower?.phone}
      
      DUE DATE: ${borrowerData?.dueDate || transactionData?.borrower?.dueDate}
      
      Thank you for using our library!
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document?.write(`
      <html>
        <head>
          <title>Library Receipt</title>
          <style>
            body { font-family: monospace; padding: 20px; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${printContent}</pre>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow?.document?.close();
  };

  const handleNewTransaction = () => {
    setShowSuccessModal(false);
    setTransactionData(null);
    handleClearForm();
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setTransactionData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <SidebarNavigation 
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      />

      <main className="lg:ml-sidebar pt-16">
        <div className="p-content-margin">
          <BreadcrumbTrail />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                <Icon name="UserCheck" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Book Lending Process</h1>
                <p className="text-muted-foreground">
                  Record new lending transactions with borrower information and due date tracking
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Two-Panel Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BookSearchPanel 
                onBookSelect={handleBookSelect}
                selectedBook={selectedBook}
              />
              
              <BorrowerDetailsPanel 
                borrowerData={borrowerData}
                onBorrowerChange={handleBorrowerChange}
                selectedBook={selectedBook}
              />
            </div>

            {/* Transaction Summary */}
            <TransactionSummary 
              selectedBook={selectedBook}
              borrowerData={borrowerData}
              onProcessLending={handleProcessLending}
              onClearForm={handleClearForm}
              onPrintReceipt={handlePrintReceipt}
              isProcessing={isProcessing}
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg border border-border p-4 library-shadow-card">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
                  <Icon name="BookOpen" size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Books</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-muted h-6 w-16 rounded"></div>
                  ) : statsError ? (
                    <p className="text-xl font-semibold text-destructive">Error</p>
                  ) : (
                    <p className="text-xl font-semibold text-foreground">
                      {stats.availableBooks.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 library-shadow-card">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Icon name="Users" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Borrowers</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-muted h-6 w-16 rounded"></div>
                  ) : statsError ? (
                    <p className="text-xl font-semibold text-destructive">Error</p>
                  ) : (
                    <p className="text-xl font-semibold text-foreground">
                      {stats.activeBorrowers.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 library-shadow-card">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-warning/10 rounded-lg">
                  <Icon name="Clock" size={20} className="text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Today</p>
                  {statsLoading ? (
                    <div className="animate-pulse bg-muted h-6 w-16 rounded"></div>
                  ) : statsError ? (
                    <p className="text-xl font-semibold text-destructive">Error</p>
                  ) : (
                    <p className="text-xl font-semibold text-foreground">
                      {stats.dueToday.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        transactionData={transactionData}
        onPrintReceipt={handlePrintReceipt}
        onNewTransaction={handleNewTransaction}
      />
    </div>
  );
};

export default BookLendingProcess;