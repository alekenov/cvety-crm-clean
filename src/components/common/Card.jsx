import React from 'react';

const Card = ({ 
  children, 
  title,
  actions,
  className = "" 
}) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {title && (
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
  </div>
);

export default Card; 