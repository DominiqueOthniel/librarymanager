import React from 'react';
import OverdueBookRow from './OverdueBookRow';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const OverdueTable = ({ 
  books, 
  selectedBooks, 
  contactedMap = {},
  onSelectAll, 
  onSelectBook,
  onSendReminder,
  onPrintNotice,
  onMarkContacted,
  onViewBorrower,
  onViewBook,
  sortConfig,
  onSort
}) => {
  const isAllSelected = books?.length > 0 && selectedBooks?.length === books?.length;
  const isIndeterminate = selectedBooks?.length > 0 && selectedBooks?.length < books?.length;

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSort = (column) => {
    onSort(column);
  };

  if (books?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center library-shadow-card">
        <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Overdue Books</h3>
        <p className="text-muted-foreground">
          Great job! All books have been returned on time or are still within their due dates.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden library-shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Priority
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground library-transition"
                >
                  Book Details
                  <Icon name={getSortIcon('title')} size={14} />
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('borrowerName')}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground library-transition"
                >
                  Borrower Info
                  <Icon name={getSortIcon('borrowerName')} size={14} />
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('dueDate')}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground library-transition"
                >
                  Due Date
                  <Icon name={getSortIcon('dueDate')} size={14} />
                </button>
              </th>

              <th className="px-4 py-3 text-center">
                <button
                  onClick={() => handleSort('daysOverdue')}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground library-transition"
                >
                  Days Overdue
                  <Icon name={getSortIcon('daysOverdue')} size={14} />
                </button>
              </th>

              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('lateFee')}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground library-transition"
                >
                  Late Fee
                  <Icon name={getSortIcon('lateFee')} size={14} />
                </button>
              </th>

              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Contact Status
              </th>

              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {books?.map((book) => {
              const bookId = book?.id ?? book?._id;
              return (
                <OverdueBookRow
                  key={bookId}
                  book={book}
                  bookId={bookId}
                  isSelected={selectedBooks?.includes(bookId)}
                  contacted={book?.contacted ?? contactedMap[bookId]?.contacted}
                  lastContactDate={book?.lastContactDate ?? contactedMap[bookId]?.date}
                  onSelect={onSelectBook}
                  onSendReminder={onSendReminder}
                  onPrintNotice={onPrintNotice}
                  onMarkContacted={onMarkContacted}
                  onViewBorrower={onViewBorrower}
                  onViewBook={onViewBook}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OverdueTable;