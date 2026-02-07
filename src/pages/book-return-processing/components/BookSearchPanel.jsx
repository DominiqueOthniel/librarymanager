import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { transactionsAPI } from '../../../services/api';

const BookSearchPanel = ({ onBookSelect, isProcessing, refreshTrigger }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Load borrowed books on mount
  useEffect(() => {
    const loadBorrowedBooks = async () => {
      setIsSearching(true);
      try {
        const response = await transactionsAPI.getAll({ 
          status: 'active',
          limit: 100 
        });
        const data = response?.data ?? response;
        const borrowedBooks = Array.isArray(data) ? data : [];
        setSearchResults(borrowedBooks);
        setShowResults(true);
      } catch (err) {
        console.error('Error loading borrowed books:', err);
        setSearchResults([]);
        setShowResults(true);
      } finally {
        setIsSearching(false);
      }
    };
    loadBorrowedBooks();
  }, [refreshTrigger]);

  // Filter results when user types
  const displayedResults = searchQuery?.length >= 2 && Array.isArray(searchResults)
    ? searchResults.filter(transaction => {
        try {
          const q = (searchQuery || '').toLowerCase();
          return (transaction?.title && String(transaction.title).toLowerCase().includes(q)) ||
            (transaction?.author && String(transaction.author).toLowerCase().includes(q)) ||
            (transaction?.isbn && String(transaction.isbn).includes(searchQuery)) ||
            (transaction?.borrower_name && String(transaction.borrower_name).toLowerCase().includes(q));
        } catch {
          return false;
        }
      })
    : Array.isArray(searchResults) ? searchResults : [];

  const handleBookSelect = (transaction) => {
    // Extract IDs - API may return populated objects {_id, title, author, isbn} or raw ObjectId
    const bookId = typeof transaction.book_id === 'object' && transaction.book_id?._id
      ? transaction.book_id._id
      : transaction.book_id;
    const borrowerId = typeof transaction.borrower_id === 'object' && transaction.borrower_id?._id
      ? transaction.borrower_id._id
      : transaction.borrower_id;
    const book = {
      id: bookId,
      title: transaction.title,
      author: transaction.author,
      isbn: transaction.isbn,
      borrower: {
        name: transaction.borrower_name,
        id: borrowerId,
        email: transaction.borrower_email
      },
      lendingDate: new Date(transaction.transaction_date),
      dueDate: new Date(transaction.due_date),
      transactionId: transaction.id || transaction._id
    };
    setSearchQuery(`${transaction?.title} - ${transaction?.author}`);
    onBookSelect(book);
  };

  const handleBarcodeScan = async () => {
    setIsScanning(true);
    try {
      const response = await transactionsAPI.getAll({ status: 'active', limit: 1 });
      const transactions = response?.data ?? response;
      const list = Array.isArray(transactions) ? transactions : [];
      if (list.length > 0) {
        handleBookSelect(list[0]);
      } else {
        alert('No borrowed books found. Lend a book first from the Lending page.');
      }
    } catch (err) {
      console.error('Error during barcode scan:', err);
      alert('Error scanning barcode');
    } finally {
      setIsScanning(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    onBookSelect(null);
  };

  return (
    <div className="bg-card rounded-lg border border-border library-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <Icon name="Search" size={20} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Book Identification</h2>
            <p className="text-sm text-muted-foreground">Search by title, author, ISBN, or borrower name</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter book title, ISBN, or borrower name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              disabled={isProcessing}
              className="pr-20"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground library-transition"
              >
                <Icon name="X" size={16} />
              </button>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="Search" size={16} className="text-muted-foreground" />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleBarcodeScan}
              disabled={isProcessing || isScanning}
              loading={isScanning}
              iconName="Scan"
              iconPosition="left"
              className="flex-1"
            >
              {isScanning ? 'Scanning...' : 'Scan Barcode'}
            </Button>
            {isSearching && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-lg p-2">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm">Searching...</span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              onClick={clearSearch}
              disabled={isProcessing || !searchQuery}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
      {/* Search Results */}
      {showResults && (
        <div className="border-b border-border">
          <div className="p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">
              {searchQuery?.length >= 2 
                ? `Found ${displayedResults?.length} borrowed book${displayedResults?.length !== 1 ? 's' : ''} matching "${searchQuery}"`
                : `${displayedResults?.length} borrowed book${displayedResults?.length !== 1 ? 's' : ''} — type to filter`
              }
            </h3>
            {displayedResults?.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {displayedResults?.map((transaction, idx) => {
                const isOverdue = transaction?.due_date && new Date(transaction.due_date) < new Date();
                return (
                  <button
                    key={transaction?.id || transaction?._id || idx}
                    onClick={() => handleBookSelect(transaction)}
                    disabled={isProcessing}
                    className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted library-transition disabled:opacity-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-foreground truncate">{transaction?.title}</p>
                          {isOverdue && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">by {transaction?.author}</p>
                        <p className="text-xs text-muted-foreground">
                          Borrowed by: {transaction?.borrower_name} • Due: {transaction?.due_date ? new Date(transaction.due_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0 ml-2" />
                    </div>
                  </button>
                );
              })}
            </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {searchResults?.length === 0 
                  ? 'No borrowed books in the system. Lend a book first from the Lending page.'
                  : `No borrowed books match "${searchQuery}". Try a different search.`
                }
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSearchPanel;