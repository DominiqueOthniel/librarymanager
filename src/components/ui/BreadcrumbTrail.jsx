import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbTrail = () => {
  const location = useLocation();
  
  const breadcrumbMap = {
    '/library-dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/book-catalog-management': { label: 'Catalog Management', icon: 'Library' },
    '/book-lending-process': { label: 'Book Lending', icon: 'UserCheck' },
    '/book-return-processing': { label: 'Book Returns', icon: 'RotateCcw' },
    '/overdue-books-dashboard': { label: 'Overdue Books', icon: 'Clock' },
    '/library-reports-center': { label: 'Reports Center', icon: 'BarChart3' }
  };

  const currentPath = location?.pathname;
  const currentPage = breadcrumbMap?.[currentPath];

  if (!currentPage || currentPath === '/library-dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Link
        to="/library-dashboard"
        className="flex items-center space-x-1 hover:text-foreground library-transition"
      >
        <Icon name="Home" size={16} />
        <span>Dashboard</span>
      </Link>
      <Icon name="ChevronRight" size={16} className="text-border" />
      <div className="flex items-center space-x-1 text-foreground font-medium">
        <Icon name={currentPage?.icon} size={16} />
        <span>{currentPage?.label}</span>
      </div>
    </nav>
  );
};

export default BreadcrumbTrail;