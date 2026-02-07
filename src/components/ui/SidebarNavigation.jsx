
import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from '../AppIcon';

const SidebarNavigation = ({ isOpen = false, onClose }) => {
  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/library-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Library overview and daily metrics'
    },
    {
      label: 'Catalog',
      path: '/book-catalog-management',
      icon: 'Library',
      tooltip: 'Manage book inventory and search'
    },
    {
      label: 'Lending',
      path: '/book-lending-process',
      icon: 'UserCheck',
      tooltip: 'Process new book checkouts'
    },
    {
      label: 'Returns',
      path: '/book-return-processing',
      icon: 'RotateCcw',
      tooltip: 'Handle book returns and receipts'
    },
    {
      label: 'Overdue',
      path: '/overdue-books-dashboard',
      icon: 'Clock',
      tooltip: 'Track and manage overdue items'
    },
    {
      label: 'Reports',
      path: '/library-reports-center',
      icon: 'BarChart3',
      tooltip: 'Analytics and data export'
    }
  ];

  const handleItemClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-sidebar lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-sidebar bg-card border-r border-border z-mobile-nav
        transform transition-transform duration-300 ease-out
        lg:translate-x-0 lg:z-sidebar
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Section - Desktop Only */}
          <div className="hidden lg:flex items-center px-sidebar-padding py-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icon name="BookOpen" size={24} color="white" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-heading font-semibold text-lg text-foreground leading-tight">
                  Library Tracker
                </h1>
                <span className="text-xs text-muted-foreground font-medium">
                  Book Management System
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between px-sidebar-padding py-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Icon name="BookOpen" size={20} color="white" />
              </div>
              <span className="font-heading font-semibold text-foreground">
                Library Tracker
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted library-transition"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-sidebar-padding py-6">
            <ul className="space-y-2">
              {navigationItems?.map((item) => (
                <li key={item?.path}>
                  <NavLink
                    to={item?.path}
                    onClick={handleItemClick}
                    className={({ isActive }) => `
                      flex items-center px-3 py-2.5 rounded-lg text-nav font-medium library-transition
                      group relative
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }
                    `}
                    title={item?.tooltip}
                  >
                    <Icon 
                      name={item?.icon} 
                      size={20} 
                      className="mr-3 flex-shrink-0"
                    />
                    <span className="truncate">{item?.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer Section */}
          <div className="px-sidebar-padding py-4 border-t border-border">
            <div className="flex items-center space-x-3 px-3 py-2">
              <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                <Icon name="User" size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Library Staff
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  staff@library.local
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarNavigation; 