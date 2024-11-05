import React from 'react';

const variants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white',
  secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
  outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50'
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-md
        font-medium
        transition-colors
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 