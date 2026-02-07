import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionSummary = ({ 
  selectedBook, 
  borrowerData, 
  onProcessLending, 
  onClearForm, 
  onPrintReceipt,
  isProcessing 
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateDaysUntilDue = () => {
    if (!borrowerData?.dueDate) return 0;
    const dueDate = new Date(borrowerData.dueDate);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isReadyToProcess = selectedBook && borrowerData?.name && borrowerData?.email && borrowerData?.phone && borrowerData?.dueDate;
  const daysUntilDue = calculateDaysUntilDue();

  if (!selectedBook && !borrowerData?.name) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 library-shadow-card">
        <div className="text-center py-8">
          <Icon name="FileText" size={48} className="mx-auto mb-3 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Transaction Summary</h3>
          <p className="text-sm text-muted-foreground">
            Select a book and enter borrower details to see the transaction summary
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6 library-shadow-card">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="FileText" size={20} className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Transaction Summary</h3>
      </div>
      <div className="space-y-6">
        {/* Book Information */}
        {selectedBook && (
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Book" size={16} className="mr-2" />
              Book Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Title:</span>
                <p className="font-medium text-foreground">{selectedBook?.title}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Author:</span>
                <p className="font-medium text-foreground">{selectedBook?.author}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Book ID:</span>
                <p className="font-medium text-foreground">{selectedBook?.id}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <p className="font-medium text-foreground">{selectedBook?.location}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <p className="font-medium text-foreground">{selectedBook?.category}</p>
              </div>
              <div>
                <span className="text-muted-foreground">ISBN:</span>
                <p className="font-medium text-foreground">{selectedBook?.isbn}</p>
              </div>
            </div>
          </div>
        )}

        {/* Borrower Information */}
        {borrowerData?.name && (
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center">
              <Icon name="User" size={16} className="mr-2" />
              Borrower Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium text-foreground">{borrowerData?.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium text-foreground">{borrowerData?.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-medium text-foreground">{borrowerData?.phone}</p>
              </div>
              {borrowerData?.membershipId && (
                <div>
                  <span className="text-muted-foreground">Membership ID:</span>
                  <p className="font-medium text-foreground">{borrowerData?.membershipId}</p>
                </div>
              )}
              {borrowerData?.address && (
                <div className="md:col-span-2">
                  <span className="text-muted-foreground">Address:</span>
                  <p className="font-medium text-foreground">{borrowerData?.address}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transaction Details */}
        {borrowerData?.dueDate && (
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Calendar" size={16} className="mr-2" />
              Lending Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Checkout Date:</span>
                <p className="font-medium text-foreground">
                  {new Date()?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Due Date:</span>
                <p className="font-medium text-foreground">{formatDate(borrowerData?.dueDate)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Lending Period:</span>
                <p className="font-medium text-foreground">
                  {daysUntilDue} {daysUntilDue === 1 ? 'day' : 'days'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Transaction ID:</span>
                <p className="font-medium text-foreground">
                  TXN-{new Date()?.getFullYear()}-{String(Date.now())?.slice(-6)}
                </p>
              </div>
            </div>
            
            {borrowerData?.notes && (
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-muted-foreground">Notes:</span>
                <p className="font-medium text-foreground mt-1">{borrowerData?.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            variant="default"
            size="lg"
            iconName="CheckCircle"
            iconPosition="left"
            onClick={onProcessLending}
            disabled={!isReadyToProcess || isProcessing}
            loading={isProcessing}
            className="flex-1"
          >
            {isProcessing ? 'Processing...' : 'Process Lending'}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            iconName="Printer"
            iconPosition="left"
            onClick={onPrintReceipt}
            disabled={!isReadyToProcess || isProcessing}
            className="flex-1 sm:flex-none"
          >
            Print Receipt
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onClearForm}
            disabled={isProcessing}
            className="flex-1 sm:flex-none"
          >
            Clear Form
          </Button>
        </div>

        {!isReadyToProcess && (selectedBook || borrowerData?.name) && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">
                  Missing Required Information
                </p>
                <ul className="text-xs text-warning/80 mt-1 space-y-1">
                  {!selectedBook && <li>• Select a book</li>}
                  {!borrowerData?.name && <li>• Enter borrower name</li>}
                  {!borrowerData?.email && <li>• Enter email address</li>}
                  {!borrowerData?.phone && <li>• Enter phone number</li>}
                  {!borrowerData?.dueDate && <li>• Set due date</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionSummary;