import React, { useState, useEffect, useMemo } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import BookSearchFilters from './components/BookSearchFilters.jsx';
import BookTable from './components/BookTable';
import BulkActionsBar from './components/BulkActionsBar';
import BookDetailsModal from './components/BookDetailsModal';
import AddEditBookModal from './components/AddEditBookModal';
import { booksAPI } from '../../services/api';

const BookCatalogManagement = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [books, setBooks] = useState([]);

  // Load books from API
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await booksAPI.getAll();
      const data = response.data || response;
      console.log('Books loaded:', data);
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Failed to load books');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort books
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = books?.filter(book => {
      const matchesSearch = !searchTerm || 
        book?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        book?.author?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        book?.isbn?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      
      const matchesCategory = !selectedCategory || book?.category === selectedCategory;
      const matchesAvailability = !availabilityFilter || book?.status === availabilityFilter;

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    // Sort books
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a?.title?.localeCompare(b?.title);
        case 'title-desc':
          return b?.title?.localeCompare(a?.title);
        case 'author':
          return a?.author?.localeCompare(b?.author);
        case 'author-desc':
          return b?.author?.localeCompare(a?.author);
        case 'date-added':
          return new Date(b.dateAdded) - new Date(a.dateAdded);
        case 'date-added-desc':
          return new Date(a.dateAdded) - new Date(b.dateAdded);
        case 'publication-date':
          return new Date(b.publicationDate) - new Date(a.publicationDate);
        case 'publication-date-desc':
          return new Date(a.publicationDate) - new Date(b.publicationDate);
        default:
          return 0;
      }
    });

    return filtered;
  }, [books, searchTerm, selectedCategory, availabilityFilter, sortBy]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCloseMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setAvailabilityFilter('');
    setSortBy('title');
  };

  const handleSelectBook = (bookId, isSelected) => {
    setSelectedBooks(prev => 
      isSelected 
        ? [...prev, bookId]
        : prev?.filter(id => id !== bookId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedBooks(isSelected ? filteredAndSortedBooks?.map(book => book?.id) : []);
  };

  const handleClearSelection = () => {
    setSelectedBooks([]);
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
    setIsDetailsModalOpen(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setIsAddEditModalOpen(true);
  };

  const handleAddNewBook = () => {
    setEditingBook(null);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteBook = async (book) => {
    if (window.confirm(`Are you sure you want to delete "${book?.title}"? This action cannot be undone.`)) {
      try {
        await booksAPI.delete(book.id);
        await loadBooks(); // Reload books from API
        setSelectedBooks(prev => prev?.filter(id => id !== book?.id));
        setIsDetailsModalOpen(false);
      } catch (err) {
        console.error('Error deleting book:', err);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  const handleSaveBook = async (bookData) => {
    try {
      if (editingBook) {
        // Update existing book
        await booksAPI.update(editingBook.id, bookData);
      } else {
        // Add new book
        await booksAPI.create(bookData);
      }
      await loadBooks(); // Reload books from API
      setIsAddEditModalOpen(false);
      setEditingBook(null);
    } catch (err) {
      console.error('Error saving book:', err);
      alert('Failed to save book. Please try again.');
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedBooks.map(id => booksAPI.delete(id)));
      await loadBooks(); // Reload books from API
      setSelectedBooks([]);
    } catch (err) {
      console.error('Error deleting books:', err);
      alert('Failed to delete some books. Please try again.');
    }
  };

  const handleBulkCategoryUpdate = (category) => {
    setBooks(prev => prev?.map(book => 
      selectedBooks?.includes(book?.id) ? { ...book, category } : book
    ));
    setSelectedBooks([]);
  };

  const handleBulkStatusUpdate = (status) => {
    setBooks(prev => prev?.map(book => 
      selectedBooks?.includes(book?.id) ? { ...book, status } : book
    ));
    setSelectedBooks([]);
  };

  const handleBarcodeClick = () => {
    alert('Barcode scanning feature would be integrated here. This would open the device camera to scan book barcodes for quick identification and cataloging.');
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
        <div className="p-content-margin">
          <div className="max-w-7xl mx-auto">
            <BreadcrumbTrail />
            
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Book Catalog Management</h1>
                <p className="text-muted-foreground">
                  Manage your library's complete book inventory with search, filtering, and bulk operations
                </p>
              </div>
              <Button
                onClick={handleAddNewBook}
                iconName="Plus"
                iconPosition="left"
                size="lg"
              >
                Add New Book
              </Button>
            </div>

            {/* Search and Filters */}
            <BookSearchFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              availabilityFilter={availabilityFilter}
              onAvailabilityChange={setAvailabilityFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onClearFilters={handleClearFilters}
              totalBooks={books?.length}
              filteredBooks={filteredAndSortedBooks?.length}
              onBarcodeClick={handleBarcodeClick}
            />

            {/* Bulk Actions */}
            <BulkActionsBar
              selectedCount={selectedBooks?.length}
              onBulkDelete={handleBulkDelete}
              onBulkCategoryUpdate={handleBulkCategoryUpdate}
              onBulkStatusUpdate={handleBulkStatusUpdate}
              onClearSelection={handleClearSelection}
            />

            {/* Books Table */}
            <BookTable
              books={filteredAndSortedBooks}
              selectedBooks={selectedBooks}
              onSelectBook={handleSelectBook}
              onSelectAll={handleSelectAll}
              onEditBook={handleEditBook}
              onDeleteBook={handleDeleteBook}
              onViewDetails={handleViewDetails}
              sortBy={sortBy}
              onSort={setSortBy}
            />

            {/* Empty State */}
            {filteredAndSortedBooks?.length === 0 && (
              <div className="text-center py-12">
                <Icon name="BookOpen" size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {books?.length === 0 ? 'No books in catalog' : 'No books match your filters'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {books?.length === 0 
                    ? 'Get started by adding your first book to the catalog' :'Try adjusting your search terms or filters to find books'
                  }
                </p>
                {books?.length === 0 ? (
                  <Button
                    onClick={handleAddNewBook}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Add Your First Book
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    iconName="RotateCcw"
                    iconPosition="left"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Modals */}
      <BookDetailsModal
        book={selectedBook}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedBook(null);
        }}
        onEdit={handleEditBook}
        onDelete={handleDeleteBook}
      />
      <AddEditBookModal
        book={editingBook}
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setEditingBook(null);
        }}
        onSave={handleSaveBook}
      />
    </div>
  );
};

export default BookCatalogManagement;