import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BookTable = ({ 
  books, 
  selectedBooks, 
  onSelectBook, 
  onSelectAll, 
  onEditBook, 
  onDeleteBook, 
  onViewDetails,
  sortBy,
  onSort
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const totalPages = Math.ceil(books?.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = books?.slice(startIndex, endIndex);

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { color: 'bg-success text-success-foreground', label: 'Available' },
      borrowed: { color: 'bg-warning text-warning-foreground', label: 'Borrowed' },
      overdue: { color: 'bg-error text-error-foreground', label: 'Overdue' },
      maintenance: { color: 'bg-muted text-muted-foreground', label: 'Maintenance' }
    };

    const config = statusConfig?.[status] || statusConfig?.available;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const getSortIcon = (column) => {
    if (sortBy === column) return 'ChevronUp';
    if (sortBy === `${column}-desc`) return 'ChevronDown';
    return 'ChevronsUpDown';
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      onSort(`${column}-desc`);
    } else {
      onSort(column);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-card border border-border rounded-lg library-shadow-card overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedBooks?.length === books?.length && books?.length > 0}
                  indeterminate={selectedBooks?.length > 0 && selectedBooks?.length < books?.length}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 hover:text-primary library-transition"
                >
                  <span>Title</span>
                  <Icon name={getSortIcon('title')} size={16} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('author')}
                  className="flex items-center space-x-1 hover:text-primary library-transition"
                >
                  <span>Author</span>
                  <Icon name={getSortIcon('author')} size={16} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">ISBN</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Category</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('publication-date')}
                  className="flex items-center space-x-1 hover:text-primary library-transition"
                >
                  <span>Published</span>
                  <Icon name={getSortIcon('publication-date')} size={16} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Status</th>
              <th className="text-center px-4 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentBooks?.map((book) => (
              <tr key={book?.id} className="hover:bg-muted/50 library-transition">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedBooks?.includes(book?.id)}
                    onChange={(e) => onSelectBook(book?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{book?.title}</div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{book?.author}</td>
                <td className="px-4 py-3 text-muted-foreground font-mono text-sm">{book?.isbn}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-medium">
                    {book?.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{book?.publicationDate}</td>
                <td className="px-4 py-3">{getStatusBadge(book?.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(book)}
                      iconName="Eye"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditBook(book)}
                      iconName="Edit"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteBook(book)}
                      iconName="Trash2"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden">
        <div className="p-4 space-y-4">
          {currentBooks?.map((book) => (
            <div key={book?.id} className="border border-border rounded-lg p-4 bg-background">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <Checkbox
                    checked={selectedBooks?.includes(book?.id)}
                    onChange={(e) => onSelectBook(book?.id, e?.target?.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{book?.title}</h3>
                    <p className="text-sm text-muted-foreground">{book?.author}</p>
                  </div>
                </div>
                {getStatusBadge(book?.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">ISBN:</span>
                  <span className="ml-1 font-mono">{book?.isbn}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-1">{book?.category}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Published:</span>
                  <span className="ml-1">{book?.publicationDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(book)}
                  iconName="Eye"
                  iconPosition="left"
                >
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditBook(book)}
                  iconName="Edit"
                  iconPosition="left"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteBook(book)}
                  iconName="Trash2"
                  iconPosition="left"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-border px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, books?.length)} of {books?.length} books
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
            />
            <span className="text-sm text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookTable;