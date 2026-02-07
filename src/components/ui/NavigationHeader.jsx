import React, { useState } from 'react';
import Icon from '../AppIcon';

const NavigationHeader = ({ onMobileMenuToggle, isMobileMenuOpen = false }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-mobile-nav bg-card border-b border-border library-shadow-card">
      <div className="flex items-center justify-between h-16 px-content-margin lg:pl-0 lg:pr-content-margin">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="lg:hidden mr-4">
            <button
              onClick={onMobileMenuToggle}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted library-transition"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <Icon 
                name={isMobileMenuOpen ? 'X' : 'Menu'} 
                size={24} 
              />
            </button>
          </div>
          
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

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted library-transition">
            <Icon name="Search" size={20} />
          </button>
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted library-transition">
            <Icon name="Bell" size={20} />
          </button>
          <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted library-transition">
            <Icon name="Settings" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavigationHeader;