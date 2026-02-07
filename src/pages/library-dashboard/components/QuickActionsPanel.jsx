import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const QuickActionsPanel = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'Add New Book',
      icon: 'Plus',
      variant: 'default',
      route: '/book-catalog-management',
      description: 'Add books to catalog'
    },
    {
      label: 'Process Lending',
      icon: 'UserCheck',
      variant: 'outline',
      route: '/book-lending-process',
      description: 'Check out books'
    },
    {
      label: 'Process Return',
      icon: 'RotateCcw',
      variant: 'outline',
      route: '/book-return-processing',
      description: 'Return books'
    },
    {
      label: 'Search Catalog',
      icon: 'Search',
      variant: 'secondary',
      route: '/book-catalog-management',
      description: 'Find books quickly'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 library-shadow-card">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action, index) => (
          <div key={index} className="space-y-2">
            <Button
              variant={action?.variant}
              iconName={action?.icon}
              iconPosition="left"
              fullWidth
              onClick={() => navigate(action?.route)}
              className="h-12"
            >
              {action?.label}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {action?.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;