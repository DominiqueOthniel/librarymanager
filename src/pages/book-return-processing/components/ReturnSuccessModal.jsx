import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReturnSuccessModal = ({ isOpen, onClose, returnData, selectedBook }) => {
  if (!isOpen || !returnData || !selectedBook) return null;

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePrintReceipt = () => {
    // Print the receipt using browser's print dialog
    window.print();
  };

  const handleNewReturn = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border library-shadow-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-border text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Return Processed Successfully</h2>
          <p className="text-sm text-muted-foreground">
            The book has been returned and inventory updated
          </p>
        </div>

        {/* Transaction Details */}
        <div className="p-6 space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <Icon name="FileText" size={16} className="mr-2" />
              Transaction Receipt
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="text-foreground font-mono">RTN-{Date.now()?.toString()?.slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time:</span>
                <span className="text-foreground">{new Date()?.toLocaleString()}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Book:</span>
                  <span className="text-foreground font-medium text-right">{selectedBook?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Author:</span>
                  <span className="text-foreground">{selectedBook?.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Book ID:</span>
                  <span className="text-foreground font-mono">{selectedBook?.id}</span>
                </div>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Borrower:</span>
                  <span className="text-foreground">{selectedBook?.borrower?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Library ID:</span>
                  <span className="text-foreground font-mono">{selectedBook?.borrower?.id}</span>
                </div>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Borrowed:</span>
                  <span className="text-foreground">{formatDate(selectedBook?.lendingDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span className="text-foreground">{formatDate(selectedBook?.dueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Returned:</span>
                  <span className="text-foreground">{formatDate(returnData?.returnDate)}</span>
                </div>
              </div>
              {returnData?.wasOverdue && (
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Overdue:</span>
                    <span className="text-destructive font-medium">{returnData?.overdueDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Late Fee:</span>
                    <span className={`font-medium ${returnData?.lateFeeWaived ? 'text-muted-foreground line-through' : 'text-destructive'}`}>
                      ${returnData?.lateFee?.toFixed(2)}
                      {returnData?.lateFeeWaived && <span className="text-success ml-2">(Waived)</span>}
                    </span>
                  </div>
                </div>
              )}
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Return Condition:</span>
                  <span className="text-foreground capitalize">{returnData?.condition}</span>
                </div>
                {returnData?.conditionNotes && (
                  <div className="mt-2">
                    <span className="text-muted-foreground text-xs">Notes:</span>
                    <p className="text-foreground text-xs mt-1 bg-background rounded p-2">
                      {returnData?.conditionNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-success/10 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="BookCheck" size={20} className="text-success" />
              <div>
                <p className="text-sm font-medium text-success">Book Status Updated</p>
                <p className="text-xs text-success/80">Available for lending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handlePrintReceipt}
              iconName="Printer"
              iconPosition="left"
              className="flex-1"
            >
              Print Receipt
            </Button>
            <Button
              variant="default"
              onClick={handleNewReturn}
              iconName="Plus"
              iconPosition="left"
              className="flex-1"
            >
              Process Another Return
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full mt-3"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReturnSuccessModal;