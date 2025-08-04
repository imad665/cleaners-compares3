import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className = '',
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const getTrendIcon = () => {
    if (trend === 'up') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    return null;
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 hover-scale ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
      <div className="mb-2">
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <div className="flex items-center">
        {/* {trend && (
          <span className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="ml-1 text-sm">{trendValue}</span>
          </span>
        )} */}
        {description && (
          <span className="text-sm text-gray-500 ml-auto">{description}</span>
        )}
      </div>
    </div>
  );
};

export default Card;