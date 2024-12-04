import React from 'react';
import { Filter, Flower2, Box, Wrench, LayoutGrid } from 'lucide-react';

const TypeFilter = ({ value, onChange }) => {
  const options = [
    { id: 'all', label: 'Все товары', icon: LayoutGrid },
    { id: 'flower', label: 'Цветы', icon: Flower2 },
    { id: 'packaging', label: 'Упаковка', icon: Box },
    { id: 'service', label: 'Услуги', icon: Wrench },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Filter size={20} />
        <span className="font-medium">Фильтр по типу</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id === 'all' ? null : option.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${
                (value === option.id) || (option.id === 'all' && !value)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Icon size={16} />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TypeFilter;
