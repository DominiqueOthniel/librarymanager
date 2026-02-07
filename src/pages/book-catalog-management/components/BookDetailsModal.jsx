import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const BookDetailsModal = ({ book, isOpen, onClose, onEdit, onDelete }) => {
  if (!isOpen || !book) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: 'bg-success text-success-foreground', label: 'Available' },
      borrowed: { color: 'bg-warning text-warning-foreground', label: 'Borrowed' },
      overdue: { color: 'bg-error text-error-foreground', label: 'Overdue' },
      maintenance: { color: 'bg-muted text-muted-foreground', label: 'Under Maintenance' }
    };

    const config = statusConfig?.[status] || statusConfig?.available;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-lg library-shadow-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Book Details</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                <Image
                  src={book?.cover_image || book?.coverImage || `https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop`}
                  alt={`Cover of ${book?.title}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Book Information */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{book?.title}</h3>
                <p className="text-lg text-muted-foreground mb-4">by {book?.author}</p>
                {getStatusBadge(book?.status)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ISBN</label>
                  <p className="font-mono text-foreground">{book?.isbn}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-foreground capitalize">{book?.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Publication Date</label>
                  <p className="text-foreground">{book?.publicationDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Publisher</label>
                  <p className="text-foreground">{book?.publisher || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Pages</label>
                  <p className="text-foreground">{book?.pages || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Language</label>
                  <p className="text-foreground">{book?.language || 'English'}</p>
                </div>
              </div>

              {book?.description && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground mt-1 leading-relaxed">{book?.description}</p>
                </div>
              )}

              {book?.status === 'borrowed' && book?.borrowerInfo && (
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <Icon name="User" size={16} className="mr-2" />
                    Current Borrower
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 text-foreground">{book?.borrowerInfo?.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="ml-2 text-foreground">{book?.borrowerInfo?.dueDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="ml-2 text-foreground">{book?.borrowerInfo?.contact}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Library Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Date Added:</span>
                    <span className="ml-2 text-foreground">{book?.dateAdded || '10/08/2025'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="ml-2 text-foreground">{book?.location || 'Section A, Shelf 3'}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Times Borrowed:</span>
                    <span className="ml-2 text-foreground">{book?.borrowCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Condition:</span>
                    <span className="ml-2 text-foreground">{book?.condition || 'Good'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="outline"
            onClick={() => onEdit(book)}
            iconName="Edit"
            iconPosition="left"
          >
            Edit Book
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(book)}
            iconName="Trash2"
            iconPosition="left"
          >
            Delete Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;