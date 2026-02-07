import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const BookDetailsModal = ({ book, contacted, isOpen, onClose, onSendReminder, onPrintNotice, onProcessReturn }) => {
  if (!isOpen || !book) return null;

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSeverityBadge = (daysOverdue) => {
    if (daysOverdue >= 15) return { color: 'bg-red-500', text: 'Critical', textColor: 'text-white' };
    if (daysOverdue >= 8) return { color: 'bg-orange-500', text: 'High Priority', textColor: 'text-white' };
    return { color: 'bg-yellow-500', text: 'Medium Priority', textColor: 'text-white' };
  };

  const daysOverdue = book?.daysOverdue ?? Math.floor(book?.overdue_days ?? 0);
  const badge = getSeverityBadge(daysOverdue);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto library-shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Icon name="Book" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Book Details</h2>
              <p className="text-sm text-muted-foreground">Complete information and borrowing history</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Book Cover and Basic Info */}
            <div className="lg:col-span-1">
              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden mb-4">
                  <Image
                    src={book?.coverUrl || `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop`}
                    alt={`Cover of ${book?.title}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge?.color} ${badge?.textColor}`}>
                    {badge?.text}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="default" fullWidth iconName="RotateCcw" iconPosition="left" onClick={() => onProcessReturn?.()}>
                  Process Return
                </Button>
                <Button variant="outline" fullWidth iconName="Mail" iconPosition="left" onClick={() => onSendReminder?.(book)}>
                  Send Reminder
                </Button>
                <Button variant="outline" fullWidth iconName="Printer" iconPosition="left" onClick={() => onPrintNotice?.(book)}>
                  Print Notice
                </Button>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Book Information */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Book Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Title</label>
                      <p className="text-foreground font-medium">{book?.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Author</label>
                      <p className="text-foreground">{book?.author}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">ISBN</label>
                      <p className="text-foreground font-mono">{book?.isbn}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Category</label>
                      <p className="text-foreground">{book?.category}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Publisher</label>
                      <p className="text-foreground">{book?.publisher}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Publication Year</label>
                      <p className="text-foreground">{book?.publicationYear}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <p className="text-foreground">{book?.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Condition</label>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        book?.condition === 'excellent' ? 'bg-green-100 text-green-800' :
                        book?.condition === 'good' ? 'bg-blue-100 text-blue-800' :
                        book?.condition === 'fair'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {book?.condition}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Borrowing Details */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Current Borrowing Details</h3>
                <div className="bg-muted rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Borrower</label>
                        <p className="text-foreground font-medium">{book?.borrower_name ?? book?.borrower?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Borrow Date</label>
                        <p className="text-foreground">{formatDate(book?.transaction_date ?? book?.borrowDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                        <p className="text-error font-medium">{formatDate(book?.due_date ?? book?.dueDate)}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Days Overdue</label>
                        <p className="text-2xl font-bold text-error">{daysOverdue} days</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Late Fee</label>
                        <p className="text-lg font-semibold text-warning">${(book?.fine_amount ?? (daysOverdue * 0.5)).toFixed(2)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Contact Status</label>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          (contacted ?? book?.contacted) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {(contacted ?? book?.contacted) ? 'Contacted' : 'Not Contacted'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Borrowing History */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Borrowing History</h3>
                <div className="space-y-3">
                  {book?.borrowingHistory?.map((history, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{history?.borrowerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(history?.borrowDate)} - {history?.returnDate ? formatDate(history?.returnDate) : 'Current'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          history?.status === 'returned' ? 'bg-green-100 text-green-800' :
                          history?.status === 'overdue'? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {history?.status}
                        </span>
                        {history?.daysOverdue > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {history?.daysOverdue} days overdue
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" iconName="RotateCcw" iconPosition="left" onClick={() => onProcessReturn?.()}>
            Process Return
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
