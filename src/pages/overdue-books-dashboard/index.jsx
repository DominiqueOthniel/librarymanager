import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationHeader from '../../components/ui/NavigationHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import OverdueStatsPanel from './components/OverdueStatsPanel';
import OverdueFilters from './components/OverdueFilters';
import OverdueTable from './components/OverdueTable';
import BorrowerModal from './components/BorrowerModal';
import BookDetailsModal from './components/BookDetailsModal';
import Button from '../../components/ui/Button';
import { transactionsAPI, reportsAPI } from '../../services/api';


const OVERDUE_CONTACTED_KEY = 'library-overdue-contacted';

const OverdueBooksPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [contactedMap, setContactedMap] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(OVERDUE_CONTACTED_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [filters, setFilters] = useState({
    search: '',
    duration: 'all',
    category: 'all',
    sortBy: 'daysOverdue'
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'daysOverdue',
    direction: 'desc'
  });
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [selectedBorrowerBook, setSelectedBorrowerBook] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isBorrowerModalOpen, setIsBorrowerModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load overdue books from API
  useEffect(() => {
    loadOverdueBooks();
  }, []);

  const loadOverdueBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionsAPI.getOverdue();
      const data = response?.data ?? response;
      const list = Array.isArray(data) ? data : [];
      setOverdueBooks(list);
    } catch (err) {
      console.error('Error loading overdue books:', err);
      setError('Failed to load overdue books');
      setOverdueBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const booksArray = Array.isArray(overdueBooks) ? overdueBooks : [];
    const totalOverdue = booksArray.length;
    const FEE_PER_DAY = 0.50;
    const totalFees = booksArray.reduce((sum, book) => {
      const days = Math.floor(book?.overdue_days || 0);
      return sum + (days * FEE_PER_DAY);
    }, 0);
    const averageDays = totalOverdue > 0
      ? Math.round(booksArray.reduce((sum, book) => sum + (book?.overdue_days || 0), 0) / totalOverdue)
      : 0;
    const borrowersAffected = new Set(
      booksArray
        .map(book => book?.borrower_name || book?.borrower_id?.name)
        .filter(Boolean)
    ).size;

    return {
      totalOverdue,
      totalFees,
      averageDays,
      borrowersAffected
    };
  }, [overdueBooks]);

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    const booksArray = Array.isArray(overdueBooks) ? overdueBooks : [];
    let filtered = booksArray.filter(book => {
      // Search filter
      if (filters?.search && !book?.borrower_name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) &&
          !book?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
        return false;
      }

      // Duration filter
      if (filters?.duration !== 'all') {
        const overdueDays = Math.floor(book?.overdue_days || 0);
        if (filters?.duration === '1-7' && (overdueDays < 1 || overdueDays > 7)) return false;
        if (filters?.duration === '8-14' && (overdueDays < 8 || overdueDays > 14)) return false;
        if (filters?.duration === '15+' && overdueDays < 15) return false;
      }

      // Category filter (if we have category data)
      if (filters?.category !== 'all' && book?.category && book?.category !== filters?.category) {
        return false;
      }

      return true;
    });

    // Sort books
    filtered?.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig?.key) {
        case 'title':
          aValue = a?.title?.toLowerCase();
          bValue = b?.title?.toLowerCase();
          break;
        case 'borrowerName':
          aValue = a?.borrower_name?.toLowerCase();
          bValue = b?.borrower_name?.toLowerCase();
          break;
        case 'dueDate':
          aValue = new Date(a.due_date);
          bValue = new Date(b.due_date);
          break;
        case 'daysOverdue':
          aValue = a?.overdue_days;
          bValue = b?.overdue_days;
          break;
        case 'lateFee':
          aValue = a?.fine_amount || 0;
          bValue = b?.fine_amount || 0;
          break;
        default:
          aValue = a?.overdue_days;
          bValue = b?.overdue_days;
      }

      if (sortConfig?.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [overdueBooks, filters, sortConfig]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      duration: 'all',
      category: 'all',
      sortBy: 'daysOverdue'
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedBooks(filteredAndSortedBooks?.map(book => book?.id ?? book?._id)?.filter(Boolean) ?? []);
    } else {
      setSelectedBooks([]);
    }
  };

  const handleSelectBook = (bookId, checked) => {
    if (checked) {
      setSelectedBooks(prev => [...prev, bookId]);
    } else {
      setSelectedBooks(prev => prev?.filter(id => id !== bookId));
    }
  };

  const handleSort = (column) => {
    setSortConfig(prev => ({
      key: column,
      direction: prev?.key === column && prev?.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const handleExportReport = () => {
    const books = filteredAndSortedBooks || [];
    const headers = ['Title', 'Author', 'ISBN', 'Borrower', 'Email', 'Phone', 'Due Date', 'Days Overdue', 'Late Fee'];
    const rows = books.map(b => [
      b?.title ?? '',
      b?.author ?? '',
      b?.isbn ?? '',
      b?.borrower_name ?? '',
      b?.borrower_email ?? '',
      b?.borrower_phone ?? '',
      b?.due_date ? new Date(b.due_date).toLocaleDateString() : '',
      Math.floor(b?.overdue_days ?? 0),
      `$${((b?.overdue_days ?? 0) * 0.5).toFixed(2)}`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `overdue-books-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSendReminder = (book) => {
    const email = book?.borrower_email ?? book?.borrower?.email;
    const borrowerName = book?.borrower_name ?? book?.borrower?.name;
    const subject = encodeURIComponent(`Library Notice: Overdue Book - ${book?.title}`);
    const body = encodeURIComponent(
      `Dear ${borrowerName},\n\nThis is a reminder that the following book is overdue:\n\n` +
      `Title: ${book?.title}\nAuthor: ${book?.author}\nDue Date: ${book?.due_date ? new Date(book.due_date).toLocaleDateString() : 'N/A'}\n` +
      `Days Overdue: ${Math.floor(book?.overdue_days ?? 0)}\nLate Fee: $${((book?.overdue_days ?? 0) * 0.5).toFixed(2)}\n\n` +
      `Please return the book as soon as possible.\n\nThank you,\nLibrary Staff`
    );
    window.location.href = email ? `mailto:${email}?subject=${subject}&body=${body}` : '#';
    if (!email) alert('No email address for this borrower.');
  };

  const handlePrintNotice = (book) => {
    const borrowerName = book?.borrower_name ?? book?.borrower?.name;
    const daysOverdue = Math.floor(book?.overdue_days ?? 0);
    const fee = (daysOverdue * 0.5).toFixed(2);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html><head><title>Overdue Notice - ${book?.title}</title>
      <style>body{font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto}
      h1{font-size:18px;border-bottom:2px solid #333;padding-bottom:8px}
      .field{margin:12px 0}.label{font-weight:bold;color:#666;font-size:12px}
      .value{margin-top:4px}</style></head><body>
      <h1>Library Overdue Notice</h1>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <div class="field"><div class="label">Borrower</div><div class="value">${borrowerName}</div></div>
      <div class="field"><div class="label">Book</div><div class="value">${book?.title} by ${book?.author}</div></div>
      <div class="field"><div class="label">Due Date</div><div class="value">${book?.due_date ? new Date(book.due_date).toLocaleDateString() : 'N/A'}</div></div>
      <div class="field"><div class="label">Days Overdue</div><div class="value">${daysOverdue}</div></div>
      <div class="field"><div class="label">Late Fee</div><div class="value">$${fee}</div></div>
      <p style="margin-top:30px">Please return this book as soon as possible.</p>
      </body></html>`
    );
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const handleBulkAction = (action) => {
    const booksToProcess = filteredAndSortedBooks?.filter(b => selectedBooks?.includes(b?.id ?? b?._id)) ?? [];
    if (booksToProcess.length === 0) return;
    if (action === 'sendReminders') {
      booksToProcess.forEach((book, i) => {
        setTimeout(() => handleSendReminder(book), i * 500);
      });
      setSelectedBooks([]);
    } else if (action === 'printNotices') {
      booksToProcess.forEach((book, i) => {
        setTimeout(() => handlePrintNotice(book), i * 800);
      });
      setSelectedBooks([]);
    }
  };

  const handleSendAllReminders = () => {
    (filteredAndSortedBooks || []).forEach((book, i) => {
      setTimeout(() => handleSendReminder(book), i * 500);
    });
  };

  const handleMarkContacted = (bookId, contacted) => {
    const newMap = {
      ...contactedMap,
      [bookId]: { contacted: !!contacted, date: contacted ? new Date().toISOString() : null }
    };
    setContactedMap(newMap);
    localStorage.setItem(OVERDUE_CONTACTED_KEY, JSON.stringify(newMap));
  };

  const handleViewBorrower = (borrower, book) => {
    setSelectedBorrower(borrower);
    setSelectedBorrowerBook(book || null);
    setIsBorrowerModalOpen(true);
  };

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsBookModalOpen(true);
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
      <main className="lg:ml-sidebar pt-16">
        <div className="px-content-margin py-6">
          <BreadcrumbTrail />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Overdue Books Dashboard</h1>
              <p className="text-muted-foreground">
                Track and manage overdue books with borrower contact capabilities
              </p>
            </div>
            
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <Button variant="outline" iconName="Download" iconPosition="left" onClick={handleExportReport}>
                Export Report
              </Button>
              <Button variant="default" iconName="Mail" iconPosition="left" onClick={handleSendAllReminders}>
                Send All Reminders
              </Button>
            </div>
          </div>

          {/* Statistics Panel */}
          <OverdueStatsPanel stats={stats} />

          {/* Filters */}
          <OverdueFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            selectedCount={selectedBooks?.length}
            onBulkAction={handleBulkAction}
          />

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading overdue books...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-destructive mr-3">⚠️</div>
                <div>
                  <h3 className="font-medium text-destructive">Error Loading Data</h3>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                  <button 
                    onClick={loadOverdueBooks}
                    className="text-sm text-primary hover:underline mt-2"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Overdue Books Table */}
          {!loading && !error && (
            <OverdueTable
              books={filteredAndSortedBooks}
              selectedBooks={selectedBooks}
              contactedMap={contactedMap}
              onSelectAll={handleSelectAll}
              onSelectBook={handleSelectBook}
              onSendReminder={handleSendReminder}
              onPrintNotice={handlePrintNotice}
              onMarkContacted={handleMarkContacted}
              onViewBorrower={handleViewBorrower}
              onViewBook={handleViewBook}
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          )}

          {/* Empty State */}
          {!loading && !error && filteredAndSortedBooks?.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium mb-2">No Overdue Books</h3>
                <p className="text-sm">All books are returned on time! Great job managing the library.</p>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Modals */}
      <BorrowerModal
        borrower={selectedBorrower}
        overdueBook={selectedBorrowerBook}
        isOpen={isBorrowerModalOpen}
        onClose={() => { setIsBorrowerModalOpen(false); setSelectedBorrowerBook(null); }}
        onSendReminder={() => selectedBorrowerBook && handleSendReminder(selectedBorrowerBook)}
      />
      <BookDetailsModal
        book={selectedBook}
        contacted={selectedBook ? (contactedMap[selectedBook?.id ?? selectedBook?._id]?.contacted ?? selectedBook?.contacted) : false}
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSendReminder={handleSendReminder}
        onPrintNotice={handlePrintNotice}
        onProcessReturn={() => { setIsBookModalOpen(false); navigate('/book-return-processing'); }}
      />
    </div>
  );
};

export default OverdueBooksPage;