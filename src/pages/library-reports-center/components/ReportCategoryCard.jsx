import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const ReportCategoryCard = ({ category, onReportSelect, selectedReport }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleReportClick = (report) => {
    onReportSelect({
      ...report,
      categoryId: category?.id,
      categoryName: category?.name
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg library-shadow-card">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted library-transition"
      >
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${category?.color}`}>
            <Icon name={category?.icon} size={20} color="white" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">{category?.name}</h3>
            <p className="text-sm text-muted-foreground">{category?.description}</p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          className="text-muted-foreground" 
        />
      </button>
      {isExpanded && (
        <div className="border-t border-border p-4 space-y-2">
          {category?.reports?.map((report) => (
            <button
              key={report?.id}
              onClick={() => handleReportClick(report)}
              className={`w-full flex items-center justify-between p-3 rounded-md text-left library-transition ${
                selectedReport?.id === report?.id && selectedReport?.categoryId === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon 
                  name={report?.icon} 
                  size={16} 
                  className={selectedReport?.id === report?.id && selectedReport?.categoryId === category?.id
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground'
                  }
                />
                <div>
                  <p className="font-medium">{report?.name}</p>
                  <p className={`text-xs ${
                    selectedReport?.id === report?.id && selectedReport?.categoryId === category?.id
                      ? 'text-primary-foreground opacity-80'
                      : 'text-muted-foreground'
                  }`}>
                    {report?.description}
                  </p>
                </div>
              </div>
              {report?.isNew && (
                <span className="px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded-full">
                  New
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportCategoryCard;