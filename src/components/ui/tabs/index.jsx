import React from 'react';

export const Tabs = ({ value, onValueChange, children, className }) => {
  return (
    <div className={`w-full ${className}`}>
      {children}
    </div>
  );
};

export const TabsList = ({ children, className }) => {
  return (
    <div className={`flex border-b ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className, onClick }) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
        ${value === children.toLowerCase() ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}
        ${className}`}
      onClick={() => onClick && onClick(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className }) => {
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
};
