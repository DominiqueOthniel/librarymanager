import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const BorrowerDetailsPanel = ({ borrowerData, onBorrowerChange, selectedBook }) => {
  const [errors, setErrors] = useState({});

  // Calculate default due date (14 days from today)
  const getDefaultDueDate = () => {
    const date = new Date();
    date?.setDate(date?.getDate() + 14);
    return date?.toISOString()?.split('T')?.[0];
  };

  const handleInputChange = (field, value) => {
    onBorrowerChange({
      ...borrowerData,
      [field]: value
    });
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!borrowerData?.name?.trim()) {
      newErrors.name = 'Borrower name is required';
    }
    
    if (!borrowerData?.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/?.test(borrowerData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!borrowerData?.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!borrowerData?.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(borrowerData.dueDate);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.dueDate = 'Due date must be in the future';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 library-shadow-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Borrower Information</h3>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter borrower's full name"
            value={borrowerData?.name || ''}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />
          
          <Input
            label="Membership ID"
            type="text"
            placeholder="Enter membership ID (optional)"
            value={borrowerData?.membershipId || ''}
            onChange={(e) => handleInputChange('membershipId', e?.target?.value)}
            description="Leave blank for guest borrowers"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="borrower@email.com"
            value={borrowerData?.email || ''}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />
          
          <Input
            label="Phone Number"
            type="tel"
            placeholder="(555) 123-4567"
            value={borrowerData?.phone || ''}
            onChange={(e) => handleInputChange('phone', e?.target?.value)}
            error={errors?.phone}
            required
          />
        </div>

        <Input
          label="Address"
          type="text"
          placeholder="Enter complete address (optional)"
          value={borrowerData?.address || ''}
          onChange={(e) => handleInputChange('address', e?.target?.value)}
          description="Full address for overdue notices"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={borrowerData?.dueDate || getDefaultDueDate()}
            onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
            error={errors?.dueDate}
            description="Standard lending period is 14 days"
            required
          />
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-foreground mb-2">
              Quick Due Date Options
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  const date = new Date();
                  date?.setDate(date?.getDate() + 7);
                  handleInputChange('dueDate', date?.toISOString()?.split('T')?.[0]);
                }}
              >
                7 Days
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  const date = new Date();
                  date?.setDate(date?.getDate() + 14);
                  handleInputChange('dueDate', date?.toISOString()?.split('T')?.[0]);
                }}
              >
                14 Days
              </Button>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  const date = new Date();
                  date?.setDate(date?.getDate() + 30);
                  handleInputChange('dueDate', date?.toISOString()?.split('T')?.[0]);
                }}
              >
                30 Days
              </Button>
            </div>
          </div>
        </div>

        <Input
          label="Notes"
          type="text"
          placeholder="Additional notes about this borrower or transaction..."
          value={borrowerData?.notes || ''}
          onChange={(e) => handleInputChange('notes', e?.target?.value)}
          description="Optional notes for staff reference"
        />

        {!selectedBook && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-warning">
                Please select a book first
              </span>
            </div>
            <p className="text-xs text-warning/80 mt-1">
              You need to select an available book before entering borrower details
            </p>
          </div>
        )}

        {selectedBook && borrowerData?.name && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Ready to Process
              </span>
            </div>
            <p className="text-xs text-success/80">
              All required information has been entered. You can now process the lending transaction.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowerDetailsPanel;