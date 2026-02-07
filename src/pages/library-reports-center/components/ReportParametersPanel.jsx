import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReportParametersPanel = ({ 
  selectedReport, 
  parameters, 
  onParameterChange, 
  onGenerateReport,
  isGenerating 
}) => {
  const formatOptions = [
    { value: 'screen', label: 'Screen View' },
    { value: 'pdf', label: 'PDF Export' },
    { value: 'csv', label: 'CSV Export' },
    { value: 'excel', label: 'Excel Export' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fiction', label: 'Fiction' },
    { value: 'non-fiction', label: 'Non-Fiction' },
    { value: 'reference', label: 'Reference' },
    { value: 'children', label: 'Children\'s Books' },
    { value: 'textbook', label: 'Textbooks' },
    { value: 'periodical', label: 'Periodicals' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'borrowed', label: 'Borrowed' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'reserved', label: 'Reserved' }
  ];

  if (!selectedReport) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">Select a Report</p>
          <p className="text-sm mb-2">1. Click a report in the categories on the left (e.g. Catalog Summary, Overdue Items)</p>
          <p className="text-sm">2. Adjust parameters if needed, then click &quot;Generate Report&quot;</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="border-b border-border pb-4">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-1">
          {selectedReport?.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {selectedReport?.categoryName} • {selectedReport?.description}
        </p>
      </div>
      <div className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={parameters?.startDate}
            onChange={(e) => onParameterChange('startDate', e?.target?.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={parameters?.endDate}
            onChange={(e) => onParameterChange('endDate', e?.target?.value)}
          />
        </div>

        {/* Category Filter */}
        {(selectedReport?.categoryId === 'inventory' || selectedReport?.categoryId === 'lending') && (
          <Select
            label="Book Category"
            options={categoryOptions}
            value={parameters?.category}
            onChange={(value) => onParameterChange('category', value)}
          />
        )}

        {/* Status Filter */}
        {selectedReport?.categoryId === 'inventory' && (
          <Select
            label="Book Status"
            options={statusOptions}
            value={parameters?.status}
            onChange={(value) => onParameterChange('status', value)}
          />
        )}

        {/* Output Format */}
        <Select
          label="Output Format"
          options={formatOptions}
          value={parameters?.format}
          onChange={(value) => onParameterChange('format', value)}
        />

        {/* Additional Options */}
        <div className="space-y-3">
          <Checkbox
            label="Include detailed breakdown"
            checked={parameters?.includeDetails}
            onChange={(e) => onParameterChange('includeDetails', e?.target?.checked)}
          />
          <Checkbox
            label="Include charts and graphs"
            checked={parameters?.includeCharts}
            onChange={(e) => onParameterChange('includeCharts', e?.target?.checked)}
          />
          <Checkbox
            label="Include borrower information"
            checked={parameters?.includeBorrower}
            onChange={(e) => onParameterChange('includeBorrower', e?.target?.checked)}
          />
        </div>
      </div>
      <div className="pt-4 border-t border-border">
        <Button
          variant="default"
          fullWidth
          loading={isGenerating}
          iconName="FileText"
          iconPosition="left"
          onClick={onGenerateReport}
        >
          {isGenerating ? 'Generating Report...' : 'Generate Report'}
        </Button>
      </div>
    </div>
  );
};

export default ReportParametersPanel;