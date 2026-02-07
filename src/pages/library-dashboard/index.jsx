import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/ui/NavigationHeader';
import SidebarNavigation from '../../components/ui/SidebarNavigation';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import MetricsCard from './components/MetricsCard';
import QuickActionsPanel from './components/QuickActionsPanel';
import RecentActivityPanel from './components/RecentActivityPanel';
import OverdueAlertsPanel from './components/OverdueAlertsPanel';
import ReportsShortcutsPanel from './components/ReportsShortcutsPanel';
import Icon from '../../components/AppIcon';
import { reportsAPI, transactionsAPI } from '../../services/api';

const LibraryDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [libraryMetrics, setLibraryMetrics] = useState([
    {
      title: 'Total Books',
      value: 0,
      icon: 'Library',
      color: 'blue',
      route: '/book-catalog-management',
      description: 'Books in catalog'
    },
    {
      title: 'Available Books',
      value: 0,
      icon: 'BookOpen',
      color: 'green',
      route: '/book-catalog-management',
      description: 'Ready for lending'
    },
    {
      title: 'Currently Borrowed',
      value: 0,
      icon: 'UserCheck',
      color: 'amber',
      route: '/book-lending-process',
      description: 'Books checked out'
    },
    {
      title: 'Overdue Books',
      value: 0,
      icon: 'Clock',
      color: 'red',
      route: '/overdue-books-dashboard',
      description: 'Require attention'
    }
  ]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Load dashboard metrics from API
  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  const loadDashboardMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const response = await reportsAPI.getDashboardSummary();
      const dashboardData = response.data || response;
      console.log('Dashboard data loaded:', dashboardData);
      
      setLibraryMetrics([
        {
          title: 'Total Books',
          value: dashboardData?.inventory?.total_books || 0,
          icon: 'Library',
          color: 'blue',
          route: '/book-catalog-management',
          description: 'Books in catalog'
        },
        {
          title: 'Available Books',
          value: dashboardData?.inventory?.available_books || 0,
          icon: 'BookOpen',
          color: 'green',
          route: '/book-catalog-management',
          description: 'Ready for lending'
        },
        {
          title: 'Currently Borrowed',
          value: dashboardData?.inventory?.borrowed_books || 0,
          icon: 'UserCheck',
          color: 'amber',
          route: '/book-lending-process',
          description: 'Books checked out'
        },
        {
          title: 'Overdue Books',
          value: dashboardData?.overdue?.overdue_count || 0,
          icon: 'Clock',
          color: 'red',
          route: '/overdue-books-dashboard',
          description: 'Require attention'
        }
      ]);
    } catch (err) {
      console.error('Error loading dashboard metrics:', err);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationHeader 
        onMobileMenuToggle={handleMobileMenuToggle}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      {/* Sidebar Navigation */}
      <SidebarNavigation 
        isOpen={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      />
      {/* Main Content */}
      <main className="lg:ml-sidebar pt-header">
        <div className="px-content-margin py-8">
          {/* Breadcrumb */}
          <BreadcrumbTrail />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Library Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome to your library management system. Monitor operations and access key functions.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {libraryMetrics?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                icon={metric?.icon}
                color={metric?.color}
                trend={metric?.trend}
                trendValue={metric?.trendValue}
                route={metric?.route}
                description={metric?.description}
              />
            ))}
          </div>

          {/* Quick Actions Panel */}
          <div className="mb-8">
            <QuickActionsPanel />
          </div>

          {/* Main Content Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activity Panel */}
            <RecentActivityPanel />

            {/* Overdue Alerts Panel */}
            <OverdueAlertsPanel />
          </div>

          {/* Reports and Data Management */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ReportsShortcutsPanel />
            </div>
            
            {/* System Status */}
            <div className="bg-card border border-border rounded-lg p-6 library-shadow-card">
              <div className="flex items-center space-x-2 mb-4">
                <Icon name="Wifi" size={20} className="text-green-600" />
                <h2 className="text-lg font-semibold text-foreground">System Status</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Offline Mode</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Local Storage</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Available</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Backup</span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date()?.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    System running smoothly. All features available offline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LibraryDashboard;