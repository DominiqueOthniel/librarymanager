import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ReturnTransactionPanel = ({ selectedBook, onProcessReturn, isProcessing }) => {
  const [returnDate, setReturnDate] = useState(new Date()?.toISOString()?.split('T')?.[0]);
  const [returnCondition, setReturnCondition] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  const [lateFeeWaived, setLateFeeWaived] = useState(false);

  const conditionOptions = [
    { value: '', label: 'Select condition...' },
    { value: 'excellent', label: 'Excellent - Like new condition' },
    { value: 'good', label: 'Good - Minor wear, fully functional' },
    { value: 'fair', label: 'Fair - Noticeable wear, still readable' },
    { value: 'poor', label: 'Poor - Significant damage' },
    { value: 'damaged', label: 'Damaged - Requires repair/replacement' }
  ];

  const calculateLateFee = () => {
    if (!selectedBook?.isOverdue || lateFeeWaived) return 0;
    const feePerDay = 0.50;
    return selectedBook?.overdueDays * feePerDay;
  };

  const handleProcessReturn = () => {
    if (!selectedBook || !returnCondition) return;

    const returnData = {
      transactionId: selectedBook?.transactionId,
      bookId: selectedBook?.id,
      borrowerId: selectedBook?.borrower?.id,
      returnDate: new Date(returnDate),
      condition: returnCondition,
      conditionNotes,
      lateFee: lateFeeWaived ? 0 : calculateLateFee(),
      lateFeeWaived,
      wasOverdue: selectedBook?.isOverdue,
      overdueDays: selectedBook?.overdueDays
    };

    onProcessReturn(returnData);
  };

  const canProcessReturn = selectedBook && returnCondition && returnDate && returnCondition !== '';

  if (!selectedBook) {
    return (
      <div className="bg-card rounded-lg border border-border library-shadow-card">
        <div className="p-6 text-center">
          <Icon name="RotateCcw" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Select a book to process return</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border library-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
            <Icon name="RotateCcw" size={20} className="text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Return Transaction</h2>
            <p className="text-sm text-muted-foreground">Process book return and update status</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Return Date */}
          <Input
            type="date"
            label="Return Date"
            value={returnDate}
            onChange={(e) => setReturnDate(e?.target?.value)}
            disabled={isProcessing}
            required
          />

          {/* Book Condition */}
          <Select
            label="Book Condition on Return"
            description="Assess the current condition of the returned book"
            options={conditionOptions}
            value={returnCondition}
            onChange={setReturnCondition}
            placeholder="Select condition..."
            required
            disabled={isProcessing}
          />

          {/* Condition Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Condition Notes
              <span className="text-muted-foreground font-normal ml-1">(Optional)</span>
            </label>
            <textarea
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e?.target?.value)}
              placeholder="Add any notes about the book's condition, damage, or special handling required..."
              disabled={isProcessing}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md text-sm text-foreground bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
          </div>
        </div>
      </div>
      {/* Late Fee Section */}
      {selectedBook?.isOverdue && (
        <div className="p-6 border-b border-border bg-destructive/5">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-2">Overdue Notice</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  This book is {selectedBook?.overdueDays} day{selectedBook?.overdueDays !== 1 ? 's' : ''} overdue.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Late Fee: ${calculateLateFee()?.toFixed(2)}
                  </span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lateFeeWaived}
                      onChange={(e) => setLateFeeWaived(e?.target?.checked)}
                      disabled={isProcessing}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-ring focus:ring-2"
                    />
                    <span className="text-sm text-muted-foreground">Waive fee</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Transaction Summary */}
      <div className="p-6 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3">Transaction Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Book:</span>
            <span className="text-foreground font-medium">{selectedBook?.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Borrower:</span>
            <span className="text-foreground">{selectedBook?.borrower?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Return Date:</span>
            <span className="text-foreground">{new Date(returnDate)?.toLocaleDateString()}</span>
          </div>
          {returnCondition && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Condition:</span>
              <span className="text-foreground capitalize">
                {conditionOptions?.find(opt => opt?.value === returnCondition)?.label?.split(' - ')?.[0]}
              </span>
            </div>
          )}
          {selectedBook?.isOverdue && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Late Fee:</span>
              <span className={`font-medium ${lateFeeWaived ? 'text-muted-foreground line-through' : 'text-destructive'}`}>
                ${calculateLateFee()?.toFixed(2)}
                {lateFeeWaived && <span className="text-success ml-2">(Waived)</span>}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="default"
            onClick={handleProcessReturn}
            disabled={!canProcessReturn || isProcessing}
            loading={isProcessing}
            iconName="Check"
            iconPosition="left"
            className="flex-1"
          >
            Process Return
          </Button>
          <Button
            variant="outline"
            disabled={isProcessing}
            iconName="Printer"
            iconPosition="left"
          >
            Print Receipt
          </Button>
          <Button
            variant="ghost"
            disabled={isProcessing}
            iconName="X"
            iconPosition="left"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReturnTransactionPanel;