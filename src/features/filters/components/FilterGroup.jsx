import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import PropTypes from 'prop-types';
import FilterBadge from './FilterBadge';

const FilterGroup = ({ 
  title, 
  filters, 
  selectedFilters, 
  onFilterToggle,
  isMultiSelectMode 
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`filter-group-${title}`}
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp size={20} className="text-gray-500" />
        ) : (
          <ChevronDown size={20} className="text-gray-500" />
        )}
      </button>

      <div
        id={`filter-group-${title}`}
        className={`
          mt-3 flex flex-wrap gap-2
          ${isOpen ? 'animate-in fade-in' : 'hidden'}
        `}
      >
        {filters.map(filter => (
          <FilterBadge
            key={filter.id}
            label={filter.label}
            count={filter.count}
            isActive={selectedFilters.includes(filter.id)}
            isMultiSelectMode={isMultiSelectMode}
            onClick={(e) => onFilterToggle(filter, e)}
            onRemove={() => onFilterToggle(filter, {})}
          />
        ))}
      </div>
    </div>
  );
};

FilterGroup.propTypes = {
  title: PropTypes.string.isRequired,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
  selectedFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterToggle: PropTypes.func.isRequired,
  isMultiSelectMode: PropTypes.bool,
};

FilterGroup.defaultProps = {
  isMultiSelectMode: false,
};

export default FilterGroup;
