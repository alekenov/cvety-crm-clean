import React from 'react';

// Компонент для верхней панели страницы
export const PageHeader = ({ 
  title, 
  children // действия справа (поиск, фильтры, кнопки)
}) => (
  <div className="bg-white rounded-lg shadow-sm mb-6">
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center space-x-3">
          {children}
        </div>
      </div>
    </div>
  </div>
);

// Компонент для карточек/секций на странице
export const PageSection = ({ 
  title, 
  actions, // кнопки/действия в заголовке секции
  children,
  className = "" 
}) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {title && (
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        {actions && <div className="flex items-center space-x-2">{actions}</div>}
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
  </div>
);

// Основной компонент-обертка для страниц
const PageLayout = ({ 
  header, // содержимое верхней панели
  children, // основной контент
  className = "" 
}) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {header}
        <div className={className}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageLayout; 