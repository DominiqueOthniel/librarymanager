import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const BookSearchFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  availabilityFilter, 
  onAvailabilityChange,
  sortBy,
  onSortChange,
  onClearFilters,
  totalBooks,
  filteredBooks,
  onBarcodeClick
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'biography', label: 'Biography' },
    { value: 'children', label: 'Children\'s Books' },
    { value: 'reference', label: 'Reference' },
    { value: 'textbook', label: 'Textbooks' }
  ];

  const availabilityOptions = [
    { value: '', label: 'All Books' },
    { value: 'available', label: 'Available Only' },
    { value: 'borrowed', label: 'Borrowed Only' },
    { value: 'overdue', label: 'Overdue Only' }
  ];

  const sortOptions = [
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'author', label: 'Author (A-Z)' },
    { value: 'author-desc', label: 'Author (Z-A)' },
    { value: 'date-added', label: 'Date Added (Newest)' },
    { value: 'date-added-desc', label: 'Date Added (Oldest)' },
    { value: 'publication-date', label: 'Publication Date (Newest)' },
    { value: 'publication-date-desc', label: 'Publication Date (Oldest)' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 library-shadow-card">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          iconName={isFiltersOpen ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
          fullWidth
        >
          Filters & Search
        </Button>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="mb-4 lg:mb-0">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search by title, author, ISBN, or keywords..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e?.target?.value)}
            className="pl-10"
          />
          <Icon 
            name="Search" 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
        </div>
      </div>
      {/* Filters Section */}
      <div className={`${isFiltersOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <Select
            label="Category"
            options={categoryOptions}
            value={selectedCategory}
            onChange={onCategoryChange}
            placeholder="Select category"
          />

          <Select
            label="Availability"
            options={availabilityOptions}
            value={availabilityFilter}
            onChange={onAvailabilityChange}
            placeholder="Select availability"
          />

          <Select
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            placeholder="Select sort order"
          />

          <div className="flex flex-col justify-end">
            <Button
              variant="outline"
              onClick={onBarcodeClick}
              iconName="Scan"
              iconPosition="left"
              className="mb-2"
            >
              Scan Barcode
            </Button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Showing {filteredBooks} of {totalBooks} books
            </span>
            {(searchTerm || selectedCategory || availabilityFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                iconName="X"
                iconPosition="left"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSearchFilters;