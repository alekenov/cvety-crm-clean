import React, { forwardRef } from 'react';
import { Filter } from 'lucide-react';

export const FilterGroup = ({
  icon: Icon = Filter,
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Icon size={20} className="text-gray-600" />
        <span className="font-medium text-gray-700">{title}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};

const FilterButton = forwardRef(({
  active,
  onClick,
  children,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const baseStyles = "px-4 py-2 rounded-full text-sm transition-colors";
  const variants = {
    default: {
      active: "bg-blue-500 text-white",
      inactive: "bg-gray-100 hover:bg-gray-200 text-gray-700"
    },
    danger: {
      active: "bg-red-500 text-white",
      inactive: "bg-red-100 hover:bg-red-200 text-red-700"
    },
    success: {
      active: "bg-green-500 text-white",
      inactive: "bg-green-100 hover:bg-green-200 text-green-700"
    }
  };

  const styles = variants[variant] || variants.default;

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`${baseStyles} ${active ? styles.active : styles.inactive} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

FilterButton.displayName = 'FilterButton';

export { FilterButton };
