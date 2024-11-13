import React from 'react';

const variants = {
  default: 'bg-primary text-white hover:bg-primary/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  primary: 'bg-green-500 hover:bg-green-600 text-white'
};

const sizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10'
};

const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  icon,
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex 
        items-center 
        justify-center 
        rounded-md 
        text-sm 
        font-medium 
        ring-offset-background 
        transition-colors 
        focus-visible:outline-none 
        focus-visible:ring-2 
        focus-visible:ring-ring 
        focus-visible:ring-offset-2 
        disabled:pointer-events-none 
        disabled:opacity-50
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
};

export default Button; 