import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { transactionsAPI } from '../../../services/api';

const RecentActivityPanel = () => {
  const navigate = useNavigate();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRecentTransactions();
  }, []);

  const loadRecentTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await transactionsAPI.getAll({ limit: 5 });
      const data = response.data || response;
      console.log('Recent transactions data:', data);
      setRecentTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading recent transactions:', err);
      setError('Failed to load recent activity');
      setRecentTransactions([]);
    } finally {
      setLoading(false);
    }
  };


  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg library-shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="ExternalLink"
            iconPosition="right"
            onClick={() => navigate('/library-reports-center')}
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
              <p className="text-sm text-muted-foreground">Loading recent activity...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="text-destructive mr-3">⚠️</div>
              <div>
                <h4 className="font-medium text-destructive">Error Loading Activity</h4>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                <button 
                  onClick={loadRecentTransactions}
                  className="text-sm text-primary hover:underline mt-2"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transactions List */}
        {!loading && !error && Array.isArray(recentTransactions) && recentTransactions.length > 0 && (
          <div className="space-y-4">
            {recentTransactions.map((transaction) => {
              if (!transaction || !transaction.id) return null;
              
              return (
                <div key={transaction.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 library-transition">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${transaction.transaction_type === 'lend' ?'bg-blue-100 text-blue-600' :'bg-green-100 text-green-600'
                    }
                  `}>
                    <Icon 
                      name={transaction.transaction_type === 'lend' ? 'BookOpen' : 'BookCheck'} 
                      size={20} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {transaction.title || 'Unknown Book'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.transaction_type === 'lend' ? 'Borrowed by' : 'Returned by'} {transaction.borrower_name || 'Unknown Borrower'}
                        </p>
                        {transaction.transaction_type === 'lend' && transaction.return_date === null && transaction.due_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {formatDate(new Date(transaction.due_date))}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-right flex-shrink-0 ml-4">
                        <span className="text-xs text-muted-foreground">
                          {transaction.transaction_date ? formatTimeAgo(new Date(transaction.transaction_date)) : 'Unknown time'}
                        </span>
                        <div className={`
                          inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1
                          ${transaction.transaction_type === 'lend' ?'bg-blue-100 text-blue-800' :'bg-green-100 text-green-800'
                          }
                        `}>
                          {transaction.transaction_type === 'lend' ? 'Lent' : 'Returned'}
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
        {!loading && !error && (!Array.isArray(recentTransactions) || recentTransactions.length === 0) && (
          <div className="text-center py-8">
            <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
            <p className="text-sm text-muted-foreground">
              Lending and return transactions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityPanel;