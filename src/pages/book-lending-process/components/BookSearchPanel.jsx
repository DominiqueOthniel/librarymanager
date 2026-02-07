import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { booksAPI } from '../../../services/api';

const BookSearchPanel = ({ onBookSelect, selectedBook }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const searchBooks = async () => {
      if (searchQuery?.length >= 2) {
        setIsSearching(true);
        setSearchError(null);
        
        try {
          console.log('Searching for books with query:', searchQuery);
          const response = await booksAPI.getAll({
            search: searchQuery,
            status: 'available' // Only show available books for lending
          });
          const results = response.data || response;
          console.log('Search results:', results);
          setSearchResults(Array.isArray(results) ? results : []);
          setShowResults(true);
        } catch (error) {
          console.error('Error searching books:', error);
          setSearchError('Failed to search books');
          setSearchResults([]);
          setShowResults(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
        setSearchError(null);
      }
    };

    // Debounce the search
    const timeoutId = setTimeout(searchBooks, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleBookSelect = (book) => {
    if (book?.status !== 'available') {
      return;
    }
    onBookSelect(book);
    setSearchQuery(`${book?.title} - ${book?.author}`);
    setShowResults(false);
  };

  const handleBarcodeScan = async () => {
    setIsScanning(true);
    try {
      // Simulate barcode scanning - in a real app, this would use a barcode scanner
      // For now, we'll get a random available book
      const response = await booksAPI.getAll({ status: 'available' });
      const availableBooks = response.data || response;
      if (availableBooks && availableBooks.length > 0) {
        const randomBook = availableBooks[0];
        handleBookSelect(randomBook);
      } else {
        alert('No available books found for scanning');
      }
    } catch (error) {
      console.error('Error during barcode scan:', error);
      alert('Error scanning barcode');
    } finally {
      setIsScanning(false);
    }
  };

  const clearSelection = () => {
    setSearchQuery('');
    setShowResults(false);
    onBookSelect(null);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 library-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Book Selection</h3>
        <Button
          variant="outline"
          size="sm"
          iconName="Scan"
          iconPosition="left"
          onClick={handleBarcodeScan}
          loading={isScanning}
          disabled={isScanning}
        >
          {isScanning ? 'Scanning...' : 'Scan Barcode'}
        </Button>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Search Books"
            type="search"
            placeholder="Enter title, author, ISBN, or book ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            description="Search by title, author, ISBN, or book ID"
          />
          
          {isSearching && searchQuery?.length >= 2 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-lg library-shadow-modal p-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Searching books...</span>
              </div>
            </div>
          )}

          {showResults && !isSearching && searchResults?.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-lg library-shadow-modal max-h-64 overflow-y-auto">
              {searchResults?.map((book) => (
                <button
                  key={book?.id}
                  onClick={() => handleBookSelect(book)}
                  disabled={book?.status !== 'available'}
                  className={`w-full text-left px-4 py-3 border-b border-border last:border-b-0 library-transition ${
                    book?.status === 'available'
                      ? 'hover:bg-muted cursor-pointer' :'opacity-50 cursor-not-allowed bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {book?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        by {book?.author} • {book?.category}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {book?.id} • ISBN: {book?.isbn}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {book?.status === 'available' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-error/10 text-error">
                          Checked Out
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showResults && !isSearching && searchResults?.length === 0 && searchQuery?.length >= 2 && !searchError && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-lg library-shadow-modal p-4">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Icon name="Search" size={16} />
                <span className="text-sm">No available books found matching "{searchQuery}"</span>
              </div>
            </div>
          )}

          {searchError && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-card border border-border rounded-lg library-shadow-modal p-4">
              <div className="flex items-center space-x-2 text-destructive">
                <Icon name="AlertCircle" size={16} />
                <span className="text-sm">{searchError}</span>
              </div>
            </div>
          )}
        </div>

        {selectedBook && (
          <div className="bg-muted rounded-lg p-4 border-l-4 border-l-success">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Book Selected</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {selectedBook?.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  by {selectedBook?.author}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">ID:</span> {selectedBook?.id}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {selectedBook?.location}
                  </div>
                  <div>
                    <span className="font-medium">Category:</span> {selectedBook?.category}
                  </div>
                  <div>
                    <span className="font-medium">ISBN:</span> {selectedBook?.isbn}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={clearSelection}
                className="ml-2"
              >
              </Button>
            </div>
          </div>
        )}

        {!selectedBook && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Search" size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Search for a book to begin the lending process</p>
            <p className="text-xs mt-1">You can search by title, author, ISBN, or book ID</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearchPanel;