import React from 'react';
import Icon from '../../../components/AppIcon';

const OverdueStatsPanel = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Overdue Books',
      value: stats?.totalOverdue,
      icon: 'Clock',
      color: 'text-error',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Total Fees Owed',
      value: `$${stats?.totalFees?.toFixed(2)}`,
      icon: 'DollarSign',
      color: 'text-warning',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Average Days Overdue',
      value: `${stats?.averageDays} days`,
      icon: 'Calendar',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted'
    },
    {
      title: 'Borrowers Affected',
      value: stats?.borrowersAffected,
      icon: 'Users',
      color: 'text-secondary',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 library-shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {stat?.title}
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {stat?.value}
              </p>
            </div>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat?.bgColor}`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverdueStatsPanel;