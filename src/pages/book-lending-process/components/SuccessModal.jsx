import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessModal = ({ isOpen, onClose, transactionData, onPrintReceipt, onNewTransaction }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border library-shadow-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
              <Icon name="CheckCircle" size={32} className="text-success" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Lending Successful!
            </h2>
            <p className="text-sm text-muted-foreground">
              The book has been successfully checked out to the borrower.
            </p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4 mb-6">
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Icon name="FileText" size={16} className="mr-2" />
                Transaction Details
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-medium text-foreground">
                    TXN-{new Date()?.getFullYear()}-{String(Date.now())?.slice(-6)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium text-foreground">
                    {new Date()?.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="font-medium text-foreground">
                    {formatDate(transactionData?.borrower?.dueDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Book" size={16} className="mr-2" />
                Book Information
              </h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Title:</span>
                  <p className="font-medium text-foreground">{transactionData?.book?.title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Author:</span>
                  <p className="font-medium text-foreground">{transactionData?.book?.author}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Book ID:</span>
                  <p className="font-medium text-foreground">{transactionData?.book?.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3 flex items-center">
                <Icon name="User" size={16} className="mr-2" />
                Borrower Information
              </h3>
              
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium text-foreground">{transactionData?.borrower?.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium text-foreground">{transactionData?.borrower?.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>
                  <p className="font-medium text-foreground">{transactionData?.borrower?.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Reminders */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-primary mb-2 flex items-center">
              <Icon name="Info" size={16} className="mr-2" />
              Important Reminders
            </h4>
            <ul className="text-xs text-primary/80 space-y-1">
              <li>• Email reminder will be sent 3 days before due date</li>
              <li>• Late fees apply after the due date</li>
              <li>• Book can be renewed once if no holds exist</li>
              <li>• Contact library for any questions or concerns</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              size="lg"
              iconName="Printer"
              iconPosition="left"
              onClick={onPrintReceipt}
              className="flex-1"
            >
              Print Receipt
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              iconName="Plus"
              iconPosition="left"
              onClick={onNewTransaction}
              className="flex-1"
            >
              New Transaction
            </Button>
          </div>

          <div className="mt-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              fullWidth
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;