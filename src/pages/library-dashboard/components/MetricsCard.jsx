import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, icon, color, trend, trendValue, route, description }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (route) {
      navigate(route);
    }
  };

  const getColorClasses = (colorType) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      amber: 'bg-amber-50 text-amber-600 border-amber-200',
      red: 'bg-red-50 text-red-600 border-red-200'
    };
    return colors?.[colorType] || colors?.blue;
  };

  return (
    <div 
      className={`
        bg-card border border-border rounded-lg p-6 library-shadow-card library-transition
        ${route ? 'cursor-pointer hover:library-shadow-modal hover:scale-[1.02]' : ''}
      `}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${getColorClasses(color)}
            `}>
              <Icon name={icon} size={24} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                {title}
              </h3>
              <p className="text-2xl font-bold text-foreground">
                {value?.toLocaleString()}
              </p>
            </div>
          </div>
          
          {description && (
            <p className="text-xs text-muted-foreground mb-2">
              {description}
            </p>
          )}
          
          {trend && trendValue && (
            <div className="flex items-center space-x-1">
              <Icon 
                name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={trend === 'up' ? 'text-green-600' : 'text-red-600'}
              />
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trendValue}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        
        {route && (
          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
        )}
      </div>
    </div>
  );
};

export default MetricsCard;