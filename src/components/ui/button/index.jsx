import React from 'react';

const variants = {
  default: 'bg-blue-500 text-white hover:bg-blue-600',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-gray-200 bg-white hover:bg-gray-100',
  ghost: 'hover:bg-gray-100',
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 px-3',
  lg: 'h-12 px-8',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef(({ 
  className,
  variant = "default",
  size = "default",
  children,
  ...props 
}, ref) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium 
        ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 
        focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none 
        disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});
