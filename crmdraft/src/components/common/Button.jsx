import React from 'react';

const variants = {
  primary: 'bg-green-500 text-white hover:bg-green-600',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
};

const sizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  icon,
  className = "",
  ...props 
}) => (
  <button
    className={`
      rounded-lg flex items-center justify-center transition-colors
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}
    {...props}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </button>
);

export default Button; 