import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BorrowerModal = ({ borrower, overdueBook, isOpen, onClose, onSendReminder }) => {
  if (!isOpen || !borrower) return null;

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto library-shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
              <Icon name="User" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Borrower Details</h2>
              <p className="text-sm text-muted-foreground">Complete borrowing history and contact information</p>
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
          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="text-foreground font-medium">{borrower?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <p className="text-foreground">{borrower?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <p className="text-foreground">{borrower?.phone}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Library ID</label>
                  <p className="text-foreground font-mono">{borrower?.libraryId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-foreground">{formatDate(borrower?.memberSince)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    borrower?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {borrower?.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Borrowing Statistics */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Borrowing Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{borrower?.stats?.totalBorrowed}</p>
                <p className="text-sm text-muted-foreground">Total Borrowed</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{borrower?.stats?.currentlyBorrowed}</p>
                <p className="text-sm text-muted-foreground">Currently Borrowed</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-error">{borrower?.stats?.overdue}</p>
                <p className="text-sm text-muted-foreground">Overdue Books</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-warning">${borrower?.stats?.totalFees?.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Outstanding Fees</p>
              </div>
            </div>
          </div>

          {/* Recent Borrowing History */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Borrowing History</h3>
            <div className="space-y-3">
              {borrower?.recentHistory?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item?.title}</p>
                    <p className="text-sm text-muted-foreground">by {item?.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(item?.borrowDate)} - {item?.returnDate ? formatDate(item?.returnDate) : 'Not Returned'}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item?.status === 'returned' ? 'bg-green-100 text-green-800' : 
                      item?.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item?.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact History */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact History</h3>
            <div className="space-y-3">
              {borrower?.contactHistory?.map((contact, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full flex-shrink-0">
                    <Icon name={contact?.type === 'email' ? 'Mail' : 'Phone'} size={16} color="white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{contact?.subject}</p>
                    <p className="text-sm text-muted-foreground">{contact?.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(contact?.date)} via {contact?.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="default" iconName="Mail" iconPosition="left" onClick={() => onSendReminder?.()}>
            Send Email
          </Button>
          <a href={borrower?.phone ? `tel:${borrower.phone}` : '#'}>
            <Button variant="outline" iconName="Phone" iconPosition="left">
              Call Borrower
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BorrowerModal;