import React from 'react';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';

const FilterBadge = ({ 
  label, 
  count, 
  isActive, 
  onClick, 
  onRemove,
  isMultiSelectMode 
}) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-2 rounded-full text-sm flex items-center gap-2 transition-all
      ${isActive 
        ? 'bg-green-500 text-white shadow-sm hover:bg-green-600' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }
      ${isMultiSelectMode ? 'ring-2 ring-blue-400' : ''}
    `}
  >
    <span>{label}</span>
    {count > 0 && (
      <span className="opacity-75">({count})</span>
    )}
    {isActive && (
      <X 
        size={14} 
        className="hover:text-white/80 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        aria-label="Удалить фильтр"
      />
    )}
  </button>
);

FilterBadge.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number,
  isActive: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  isMultiSelectMode: PropTypes.bool,
};

FilterBadge.defaultProps = {
  count: 0,
  isActive: false,
  isMultiSelectMode: false,
};

export default FilterBadge;
