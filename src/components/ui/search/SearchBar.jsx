import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export const SearchBar = ({ 
  placeholder = 'Поиск...', 
  value, 
  onChange,
  onClear,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`pl-10 pr-10 py-2 w-full rounded-lg border 
          ${isFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'}
          focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500
          placeholder-gray-400`}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
            hover:text-gray-600 focus:outline-none"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
