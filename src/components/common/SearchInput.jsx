import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder, className = "" }) => (
  <div className={`relative ${className}`}>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="pl-10 pr-4 py-2 border rounded-lg w-full"
    />
    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
  </div>
);

export default SearchInput; 