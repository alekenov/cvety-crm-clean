import React from 'react';

const variants = {
  default: 'bg-gray-100 text-gray-900',
  secondary: 'bg-gray-100 text-gray-900',
  destructive: 'bg-red-100 text-red-900',
  outline: 'text-gray-900 border border-gray-200',
  success: 'bg-green-100 text-green-900',
  warning: 'bg-yellow-100 text-yellow-900',
};

export const Badge = React.forwardRef(({ 
  className,
  variant = "default",
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full border border-transparent 
        px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none 
        focus:ring-2 focus:ring-gray-950 focus:ring-offset-2
        ${variants[variant]}
        ${className}`}
      {...props}
    />
  );
});
