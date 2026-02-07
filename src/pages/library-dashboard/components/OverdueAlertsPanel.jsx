import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { transactionsAPI } from '../../../services/api';

const OverdueAlertsPanel = () => {
  const navigate = useNavigate();
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOverdueBooks();
  }, []);

  const loadOverdueBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionsAPI.getOverdue();
      const data = response.data || response;
      console.log('Overdue books data:', data);
      setOverdueBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading overdue books:', err);
      setError('Failed to load overdue alerts');
      setOverdueBooks([]);
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getSeverityColor = (daysOverdue) => {
    if (daysOverdue >= 10) return 'text-red-600 bg-red-50 border-red-200';
    if (daysOverdue >= 5) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getSeverityIcon = (daysOverdue) => {
    if (daysOverdue >= 10) return 'AlertTriangle';
    if (daysOverdue >= 5) return 'Clock';
    return 'AlertCircle';
  };

  return (
    <div className="bg-card border border-border rounded-lg library-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-red-600" />
            <h2 className="text-lg font-semibold text-foreground">Overdue Alerts</h2>
            {overdueBooks?.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {overdueBooks?.length} overdue
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => navigate('/overdue-books-dashboard')}
          >
            View All
          </Button>
        </div>
      </div>
      <div className="p-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading overdue alerts...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="text-destructive mr-3">⚠️</div>
              <div>
                <h4 className="font-medium text-destructive">Error Loading Overdue Alerts</h4>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                <button 
                  onClick={loadOverdueBooks}
                  className="text-sm text-primary hover:underline mt-2"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overdue Books List */}
        {!loading && !error && Array.isArray(overdueBooks) && overdueBooks.length > 0 && (
          <div className="space-y-4">
            {overdueBooks.map((book) => {
              if (!book || !book.id) return null;
              
              return (
                <div key={book.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 library-transition">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                        ${getSeverityColor(Math.floor(book.overdue_days || 0))}
                      `}>
                        <Icon 
                          name={getSeverityIcon(Math.floor(book.overdue_days || 0))} 
                          size={20} 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-foreground truncate">
                              {book.title || 'Unknown Book'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Borrowed by {book.borrower_name || 'Unknown Borrower'}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>Due: {book.due_date ? formatDate(new Date(book.due_date)) : 'Unknown'}</span>
                              <span>•</span>
                              <span>ISBN: {book.isbn || 'N/A'}</span>
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0 ml-4">
                            <div className={`
                              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                              ${getSeverityColor(Math.floor(book.overdue_days || 0))}
                            `}>
                              {Math.floor(book.overdue_days || 0)} days overdue
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-3 text-xs">
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Icon name="Mail" size={14} />
                            <span>{book.borrower_email || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Icon name="Phone" size={14} />
                            <span>{book.borrower_phone || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (!Array.isArray(overdueBooks) || overdueBooks.length === 0) && (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="text-green-600 mx-auto mb-4" />
            <p className="text-foreground font-medium">No overdue books!</p>
            <p className="text-sm text-muted-foreground">
              All borrowed books are returned on time
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueAlertsPanel;