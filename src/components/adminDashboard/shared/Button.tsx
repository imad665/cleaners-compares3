import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white border-transparent focus:ring-gray-500';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500';
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent focus:ring-yellow-500';
      case 'outline':
        return 'bg-transparent hover:bg-gray-50 text-gray-700 border-gray-300 focus:ring-blue-500';
      case 'ghost':
        return 'bg-transparent hover:bg-gray-50 text-gray-700 border-transparent focus:ring-gray-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent focus:ring-blue-500';
    }
  };
  
  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-5 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };
  
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center border rounded-md shadow-sm font-medium 
        focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon && iconPosition === 'left' ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading ? (
        <span className="ml-2">{icon}</span>
      ) : null}
    </button>
  );
};

export default Button;