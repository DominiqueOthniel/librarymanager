import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import BookSearchPanel from './components/BookSearchPanel';
import LendingInfoPanel from './components/LendingInfoPanel';
import ReturnTransactionPanel from './components/ReturnTransactionPanel';
import ReturnSuccessModal from './components/ReturnSuccessModal';
import { reportsAPI, transactionsAPI } from '../../services/api';

const BookReturnProcessing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [refreshListTrigger, setRefreshListTrigger] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [returnData, setReturnData] = useState(null);
  
  // Statistics state
  const [stats, setStats] = useState({
    dueToday: 0,
    overdueBooks: 0,
    returnsToday: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Load statistics data
  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        setStatsError(null);
        
        // Fetch transactions due today
        const today = new Date().toISOString().split('T')[0];
        const dueTodayData = await transactionsAPI.getAll({ 
          due_date: today,
          status: 'borrowed'
        });
        console.log('Due today data for returns:', dueTodayData);
        
        // Fetch overdue books
        const overdueData = await transactionsAPI.getOverdue();
        console.log('Overdue data for returns:', overdueData);
        
        // Fetch returns processed today
        const returnsTodayData = await transactionsAPI.getAll({ 
          return_date: today,
          status: 'returned'
        });
        console.log('Returns today data:', returnsTodayData);
        
        setStats({
          dueToday: Array.isArray(dueTodayData) ? dueTodayData.length : 0,
          overdueBooks: Array.isArray(overdueData) ? overdueData.length : 0,
          returnsToday: Array.isArray(returnsTodayData) ? returnsTodayData.length : 0
        });
      } catch (error) {
        console.error('Error loading return statistics:', error);
        setStatsError(error.message || 'Failed to load statistics');
        // Set fallback values
        setStats({
          dueToday: 0,
          overdueBooks: 0,
          returnsToday: 0
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

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleProcessReturn = async (returnTransactionData) => {
    if (!returnTransactionData?.transactionId) {
      alert('Missing transaction ID. Please select the book again.');
      return;
    }
    setIsProcessing(true);
    try {
      await transactionsAPI.return({
        transaction_id: returnTransactionData.transactionId,
        fine_amount: returnTransactionData.lateFee || 0,
        notes: returnTransactionData.conditionNotes || ''
      });
      setReturnData(returnTransactionData);
      setShowSuccessModal(true);
      setSelectedBook(null);
      setRefreshListTrigger(t => t + 1);
    } catch (error) {
      console.error('Error processing return:', error);
      alert(`Failed to process return: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setReturnData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader 
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <SidebarNavigation 
        isOpen={isMobileMenuOpen}
        onClose={handleCloseMobileMenu}
      />

      <main className="lg:ml-sidebar pt-header">
        <div className="p-content-margin">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbTrail />
            
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Book Return Processing</h1>
              <p className="text-muted-foreground">
                Process returned books and update inventory status efficiently
              </p>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <BookSearchPanel 
                  refreshTrigger={refreshListTrigger}
                  onBookSelect={handleBookSelect}
                  isProcessing={isProcessing}
                />
                
                <div className="xl:hidden">
                  <LendingInfoPanel selectedBook={selectedBook} />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="hidden xl:block">
                  <LendingInfoPanel selectedBook={selectedBook} />
                </div>
                
                <ReturnTransactionPanel 
                  selectedBook={selectedBook}
                  onProcessReturn={handleProcessReturn}
                  isProcessing={isProcessing}
                />
              </div>
            </div>

            {/* Quick Stats */}
            {!selectedBook && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg border border-border p-4 library-shadow-card">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                      {statsLoading ? (
                        <div className="animate-pulse bg-muted h-6 w-6 rounded"></div>
                      ) : statsError ? (
                        <span className="text-lg font-bold text-destructive">!</span>
                      ) : (
                        <span className="text-lg font-bold text-primary">{stats.dueToday}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Books Due Today</p>
                      <p className="text-xs text-muted-foreground">Expected returns</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-4 library-shadow-card">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-lg">
                      {statsLoading ? (
                        <div className="animate-pulse bg-muted h-6 w-6 rounded"></div>
                      ) : statsError ? (
                        <span className="text-lg font-bold text-destructive">!</span>
                      ) : (
                        <span className="text-lg font-bold text-destructive">{stats.overdueBooks}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Overdue Books</p>
                      <p className="text-xs text-muted-foreground">Require attention</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg border border-border p-4 library-shadow-card">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-success/10 rounded-lg">
                      {statsLoading ? (
                        <div className="animate-pulse bg-muted h-6 w-6 rounded"></div>
                      ) : statsError ? (
                        <span className="text-lg font-bold text-destructive">!</span>
                      ) : (
                        <span className="text-lg font-bold text-success">{stats.returnsToday}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Returns Today</p>
                      <p className="text-xs text-muted-foreground">Processed successfully</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ReturnSuccessModal 
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        returnData={returnData}
        selectedBook={selectedBook}
      />
    </div>
  );
};

export default BookReturnProcessing;