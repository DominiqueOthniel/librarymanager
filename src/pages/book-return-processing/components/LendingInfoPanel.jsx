import React from 'react';
import Icon from '../../../components/AppIcon';

const LendingInfoPanel = ({ selectedBook }) => {
  if (!selectedBook) {
    return (
      <div className="bg-card rounded-lg border border-border library-shadow-card">
        <div className="p-6 text-center">
          <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Select a book to view lending information</p>
        </div>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      const d = date instanceof Date ? date : new Date(date);
      return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const calculateLateFee = () => {
    if (!selectedBook?.isOverdue) return 0;
    const feePerDay = 0.50; // $0.50 per day
    return selectedBook?.overdueDays * feePerDay;
  };

  return (
    <div className="bg-card rounded-lg border border-border library-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-secondary/10 rounded-lg">
            <Icon name="FileText" size={20} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Lending Information</h2>
            <p className="text-sm text-muted-foreground">Current loan details and status</p>
          </div>
        </div>

        {/* Book Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Book Title</label>
              <p className="text-sm font-medium text-foreground mt-1">{selectedBook?.title}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Author</label>
              <p className="text-sm font-medium text-foreground mt-1">{selectedBook?.author}</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Book ID</label>
              <p className="text-sm font-medium text-foreground mt-1">
                {typeof selectedBook?.id === 'object' ? (selectedBook?.id?._id ?? 'N/A') : (selectedBook?.id ?? 'N/A')}
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">ISBN</label>
              <p className="text-sm font-medium text-foreground mt-1">{selectedBook?.isbn}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Borrower Information */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
          <Icon name="User" size={16} className="mr-2" />
          Borrower Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</label>
            <p className="text-sm font-medium text-foreground mt-1">{selectedBook?.borrower?.name}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Library ID</label>
            <p className="text-sm font-medium text-foreground mt-1">
              {typeof selectedBook?.borrower?.id === 'object' ? (selectedBook?.borrower?.id?._id ?? 'N/A') : (selectedBook?.borrower?.id ?? 'N/A')}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
            <p className="text-sm text-foreground mt-1">{selectedBook?.borrower?.email}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
            <p className="text-sm text-foreground mt-1">{selectedBook?.borrower?.phone}</p>
          </div>
        </div>
      </div>
      {/* Lending Status */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Calendar" size={16} className="mr-2" />
          Lending Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Lending Date</label>
            <p className="text-sm font-medium text-foreground mt-1">{formatDate(selectedBook?.lendingDate)}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Due Date</label>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm font-medium text-foreground">{formatDate(selectedBook?.dueDate)}</p>
              {selectedBook?.isOverdue && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                  <Icon name="AlertTriangle" size={12} className="mr-1" />
                  Overdue
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
            <div className="mt-1">
              {selectedBook?.isOverdue ? (
                <div className="space-y-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-destructive/10 text-destructive">
                    {selectedBook?.overdueDays} day{selectedBook?.overdueDays !== 1 ? 's' : ''} overdue
                  </span>
                  {calculateLateFee() > 0 && (
                    <p className="text-xs text-destructive font-medium">
                      Late fee: ${calculateLateFee()?.toFixed(2)}
                    </p>
                  )}
                </div>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-success/10 text-success">
                  On time
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Book Condition */}
        <div className="mt-4 pt-4 border-t border-border">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Condition</label>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
              selectedBook?.condition === 'Excellent' ? 'bg-success/10 text-success' :
              selectedBook?.condition === 'Good' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
            }`}>
              {selectedBook?.condition || 'N/A'}
            </span>
            <span className="text-xs text-muted-foreground">
              (Condition when borrowed)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LendingInfoPanel;