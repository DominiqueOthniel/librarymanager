import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OverdueFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  selectedCount,
  onBulkAction 
}) => {
  const durationOptions = [
    { value: 'all', label: 'All Durations' },
    { value: '1-7', label: '1-7 Days Overdue' },
    { value: '8-14', label: '8-14 Days Overdue' },
    { value: '15+', label: '15+ Days Overdue' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'reference', label: 'Reference' },
    { value: 'children', label: 'Children\'s Books' },
    { value: 'textbook', label: 'Textbooks' }
  ];

  const sortOptions = [
    { value: 'daysOverdue', label: 'Days Overdue (High to Low)' },
    { value: 'dueDate', label: 'Due Date (Oldest First)' },
    { value: 'borrowerName', label: 'Borrower Name (A-Z)' },
    { value: 'bookTitle', label: 'Book Title (A-Z)' },
    { value: 'fees', label: 'Late Fees (High to Low)' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 library-shadow-card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filter & Sort Overdue Books</h3>
        
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="Mail"
              iconPosition="left"
              onClick={() => onBulkAction('sendReminders')}
            >
              Send Reminders
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Printer"
              iconPosition="left"
              onClick={() => onBulkAction('printNotices')}
            >
              Print Notices
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          type="search"
          placeholder="Search borrower name..."
          value={filters?.search}
          onChange={(e) => onFilterChange('search', e?.target?.value)}
          className="w-full"
        />

        <Select
          placeholder="Filter by duration"
          options={durationOptions}
          value={filters?.duration}
          onChange={(value) => onFilterChange('duration', value)}
        />

        <Select
          placeholder="Filter by category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => onFilterChange('category', value)}
        />

        <Select
          placeholder="Sort by"
          options={sortOptions}
          value={filters?.sortBy}
          onChange={(value) => onFilterChange('sortBy', value)}
        />
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onClearFilters}
        >
          Clear All Filters
        </Button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>Color codes: Yellow (1-7 days), Orange (8-14 days), Red (15+ days)</span>
        </div>
      </div>
    </div>
  );
};

export default OverdueFilters;