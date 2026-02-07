import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReportsShortcutsPanel = () => {
  const navigate = useNavigate();

  const reportShortcuts = [
    {
      title: 'Monthly Summary',
      description: 'Books borrowed and returned this month',
      icon: 'Calendar',
      color: 'blue',
      action: () => navigate('/library-reports-center')
    },
    {
      title: 'Popular Books',
      description: 'Most frequently borrowed titles',
      icon: 'TrendingUp',
      color: 'green',
      action: () => navigate('/library-reports-center')
    },
    {
      title: 'Borrower Activity',
      description: 'Member lending history and patterns',
      icon: 'Users',
      color: 'amber',
      action: () => navigate('/library-reports-center')
    },
    {
      title: 'Inventory Status',
      description: 'Current catalog and availability',
      icon: 'Package',
      color: 'purple',
      action: () => navigate('/library-reports-center')
    }
  ];

  const dataManagementActions = [
    {
      title: 'Export Data',
      description: 'Backup library database',
      icon: 'Download',
      variant: 'outline'
    },
    {
      title: 'Import Data',
      description: 'Restore from backup',
      icon: 'Upload',
      variant: 'outline'
    }
  ];

  const getColorClasses = (colorType) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
      green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
      amber: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100'
    };
    return colors?.[colorType] || colors?.blue;
  };

  return (
    <div className="space-y-6">
      {/* Reports Section */}
      <div className="bg-card border border-border rounded-lg p-6 library-shadow-card">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Quick Reports</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {reportShortcuts?.map((report, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-lg border cursor-pointer library-transition
                ${getColorClasses(report?.color)}
              `}
              onClick={report?.action}
            >
              <div className="flex items-start space-x-3">
                <Icon name={report?.icon} size={20} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">
                    {report?.title}
                  </h3>
                  <p className="text-xs opacity-80 mt-1">
                    {report?.description}
                  </p>
                </div>
                <Icon name="ChevronRight" size={16} className="opacity-60" />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Data Management Section */}
      <div className="bg-card border border-border rounded-lg p-6 library-shadow-card">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Database" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Data Management</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dataManagementActions?.map((action, index) => (
            <div key={index} className="space-y-2">
              <Button
                variant={action?.variant}
                iconName={action?.icon}
                iconPosition="left"
                fullWidth
                className="h-12"
              >
                {action?.title}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {action?.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-muted-foreground mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">
                <strong>Offline Storage:</strong> All data is stored locally using IndexedDB. 
                Regular backups are recommended to prevent data loss.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsShortcutsPanel;