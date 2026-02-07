import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { reportsAPI } from '../../../services/api';

const QuickStatsCard = () => {
  const [quickStats, setQuickStats] = useState([
    {
      id: 1,
      label: 'Total Books',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: 'BookOpen',
      color: 'bg-primary'
    },
    {
      id: 2,
      label: 'Books Borrowed',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: 'UserCheck',
      color: 'bg-secondary'
    },
    {
      id: 3,
      label: 'Overdue Items',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: 'Clock',
      color: 'bg-warning'
    },
    {
      id: 4,
      label: 'Active Members',
      value: '0',
      change: '0',
      changeType: 'neutral',
      icon: 'Users',
      color: 'bg-accent'
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await reportsAPI.getDashboardSummary();
        const dashboardData = response.data || response;
        
        // Format numbers with commas
        const formatNumber = (num) => {
          if (num === null || num === undefined) return '0';
          return Number(num).toLocaleString();
        };

        setQuickStats([
          {
            id: 1,
            label: 'Total Books',
            value: formatNumber(dashboardData?.inventory?.total_books || 0),
            change: '0',
            changeType: 'neutral',
            icon: 'BookOpen',
            color: 'bg-primary'
          },
          {
            id: 2,
            label: 'Books Borrowed',
            value: formatNumber(dashboardData?.inventory?.borrowed_books || 0),
            change: '0',
            changeType: 'neutral',
            icon: 'UserCheck',
            color: 'bg-secondary'
          },
          {
            id: 3,
            label: 'Overdue Items',
            value: formatNumber(dashboardData?.overdue?.overdue_count || 0),
            change: '0',
            changeType: 'neutral',
            icon: 'Clock',
            color: 'bg-warning'
          },
          {
            id: 4,
            label: 'Active Members',
            value: formatNumber(dashboardData?.borrowers?.active_borrowers || 0),
            change: '0',
            changeType: 'neutral',
            icon: 'Users',
            color: 'bg-accent'
          }
        ]);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error loading quick stats:', error);
        // Keep default values (0) on error
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-lg text-foreground">Quick Statistics</h3>
        <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
              <div className="h-8 bg-background rounded mb-2"></div>
              <div className="h-8 bg-background rounded mb-1"></div>
              <div className="h-4 bg-background rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats?.map((stat) => (
            <div key={stat?.id} className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${stat?.color}`}>
                  <Icon name={stat?.icon} size={16} color="white" />
                </div>
                {stat?.changeType !== 'neutral' && (
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={stat?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                      size={12} 
                      className={stat?.changeType === 'increase' ? 'text-success' : 'text-error'}
                    />
                    <span className={`text-xs font-medium ${
                      stat?.changeType === 'increase' ? 'text-success' : 'text-error'
                    }`}>
                      {stat?.change}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{stat?.value}</p>
              <p className="text-sm text-muted-foreground">{stat?.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdated?.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};

export default QuickStatsCard;