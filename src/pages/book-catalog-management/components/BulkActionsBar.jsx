import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ 
  selectedCount, 
  onBulkDelete, 
  onBulkCategoryUpdate, 
  onBulkStatusUpdate, 
  onClearSelection 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');

  if (selectedCount === 0) return null;

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'science', label: 'Science' },
    { value: 'history', label: 'History' },
    { value: 'biography', label: 'Biography' },
    { value: 'children', label: 'Children\'s Books' },
    { value: 'reference', label: 'Reference' },
    { value: 'textbook', label: 'Textbooks' }
  ];

  const statusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'available', label: 'Available' },
    { value: 'maintenance', label: 'Under Maintenance' }
  ];

  const handleBulkCategoryUpdate = () => {
    if (bulkCategory) {
      onBulkCategoryUpdate(bulkCategory);
      setBulkCategory('');
      setShowActions(false);
    }
  };

  const handleBulkStatusUpdate = () => {
    if (bulkStatus) {
      onBulkStatusUpdate(bulkStatus);
      setBulkStatus('');
      setShowActions(false);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedCount} selected books? This action cannot be undone.`)) {
      onBulkDelete();
      setShowActions(false);
    }
  };

  return (
    <div className="bg-primary text-primary-foreground rounded-lg p-4 mb-6 library-shadow-card">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Icon name="CheckSquare" size={20} />
          <span className="font-medium">
            {selectedCount} book{selectedCount !== 1 ? 's' : ''} selected
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            Clear Selection
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowActions(!showActions)}
            iconName={showActions ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            Bulk Actions
          </Button>
        </div>
      </div>

      {showActions && (
        <div className="mt-4 pt-4 border-t border-primary-foreground/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-end space-x-2">
              <Select
                label="Update Category"
                options={categoryOptions}
                value={bulkCategory}
                onChange={setBulkCategory}
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBulkCategoryUpdate}
                disabled={!bulkCategory}
                iconName="Tag"
              >
                Update
              </Button>
            </div>

            <div className="flex items-end space-x-2">
              <Select
                label="Update Status"
                options={statusOptions}
                value={bulkStatus}
                onChange={setBulkStatus}
                className="flex-1"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBulkStatusUpdate}
                disabled={!bulkStatus}
                iconName="RefreshCw"
              >
                Update
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                iconName="Trash2"
                iconPosition="left"
                fullWidth
              >
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsBar;