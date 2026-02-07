import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';


const OverdueBookRow = ({ 
  book, 
  bookId,
  isSelected, 
  contacted = false,
  lastContactDate,
  onSelect, 
  onSendReminder, 
  onPrintNotice, 
  onMarkContacted,
  onViewBorrower,
  onViewBook 
}) => {
  const getSeverityColor = (daysOverdue) => {
    if (daysOverdue >= 15) return 'bg-red-100 border-red-200';
    if (daysOverdue >= 8) return 'bg-orange-100 border-orange-200';
    return 'bg-yellow-100 border-yellow-200';
  };

  const getSeverityBadge = (daysOverdue) => {
    if (daysOverdue >= 15) return { color: 'bg-red-500', text: 'Critical' };
    if (daysOverdue >= 8) return { color: 'bg-orange-500', text: 'High' };
    return { color: 'bg-yellow-500', text: 'Medium' };
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const daysOverdue = Math.floor(book?.overdue_days ?? book?.daysOverdue ?? 0);
  const lateFee = (book?.fine_amount ?? (daysOverdue * 0.50));
  const borrower = book?.borrower ?? { name: book?.borrower_name, email: book?.borrower_email, phone: book?.borrower_phone };
  const badge = getSeverityBadge(daysOverdue);

  return (
    <tr className={`border-b border-border hover:bg-muted/50 library-transition ${getSeverityColor(daysOverdue)}`}>
      <td className="px-4 py-3">
        <Checkbox
          checked={isSelected}
          onChange={(e) => onSelect(bookId, e?.target?.checked)}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${badge?.color}`}></div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge?.color} text-white`}>
            {badge?.text}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <button
            onClick={() => onViewBook(book)}
            className="text-sm font-medium text-foreground hover:text-primary library-transition text-left"
          >
            {book?.title}
          </button>
          <span className="text-xs text-muted-foreground">{book?.author}</span>
          <span className="text-xs text-muted-foreground">ISBN: {book?.isbn}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <button
            onClick={() => onViewBorrower(borrower, book)}
            className="text-sm font-medium text-foreground hover:text-primary library-transition text-left"
          >
            {borrower?.name}
          </button>
          <span className="text-xs text-muted-foreground">{borrower?.email}</span>
          <span className="text-xs text-muted-foreground">{borrower?.phone}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {formatDate(book?.due_date ?? book?.dueDate)}
          </span>
          <span className="text-xs text-muted-foreground">
            Borrowed: {formatDate(book?.transaction_date ?? book?.borrowDate)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold text-error">
            {daysOverdue}
          </span>
          <span className="text-xs text-muted-foreground">days</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            ${lateFee?.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground">
            {daysOverdue > 0 ? `$${(lateFee / daysOverdue)?.toFixed(2)}/day` : '-'}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-1">
          <Checkbox
            label="Contacted"
            size="sm"
            checked={contacted}
            onChange={(e) => onMarkContacted(bookId, e?.target?.checked)}
          />
          {lastContactDate && (
            <span className="text-xs text-muted-foreground">
              Last: {formatDate(lastContactDate)}
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            iconName="Mail"
            onClick={() => onSendReminder(book)}
            title="Send Reminder Email"
          />
          <Button
            variant="outline"
            size="sm"
            iconName="Printer"
            onClick={() => onPrintNotice(book)}
            title="Print Notice"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreVertical"
            title="More Actions"
          />
        </div>
      </td>
    </tr>
  );
};

export default OverdueBookRow;