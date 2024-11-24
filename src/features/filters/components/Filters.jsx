import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import FilterGroup from './FilterGroup';
import FilterBadge from './FilterBadge';
import { useSearchParams } from 'react-router-dom';

const Filters = ({ filterGroups, onFiltersChange, storageKey }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState(() => {
    // Пробуем получить фильтры из URL
    const urlFilters = searchParams.get('filters')?.split(',').filter(Boolean) || [];
    
    // Если в URL нет фильтров, пробуем получить из localStorage
    if (urlFilters.length === 0 && storageKey) {
      const savedFilters = localStorage.getItem(storageKey);
      return savedFilters ? JSON.parse(savedFilters) : [];
    }
    
    return urlFilters;
  });

  // Состояние для отслеживания последнего выбранного фильтра (для Shift-выбора)
  const [lastSelectedFilter, setLastSelectedFilter] = useState(null);
  // Состояние для отслеживания режима мультивыбора
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  
  // Обновляем URL и localStorage при изменении фильтров
  useEffect(() => {
    if (selectedFilters.length > 0) {
      searchParams.set('filters', selectedFilters.join(','));
    } else {
      searchParams.delete('filters');
    }
    setSearchParams(searchParams);
    
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(selectedFilters));
    }
    
    onFiltersChange(selectedFilters);
  }, [selectedFilters, searchParams, setSearchParams, storageKey, onFiltersChange]);

  // Обработчик клавиш для мультивыбора
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Meta') {
        setIsMultiSelectMode(true);
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Meta') {
        setIsMultiSelectMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Получаем все фильтры в плоском массиве
  const getAllFilters = useCallback(() => {
    const allFilters = [];
    Object.values(filterGroups).forEach(group => {
      group.filters.forEach(filter => {
        allFilters.push(filter);
      });
    });
    return allFilters;
  }, [filterGroups]);

  const handleFilterToggle = useCallback((filter, event) => {
    setSelectedFilters(current => {
      let newFilters = [...current];
      const filterIndex = current.indexOf(filter.id);
      const isSelected = filterIndex !== -1;

      // Если зажат Shift и есть последний выбранный фильтр
      if (event.shiftKey && lastSelectedFilter) {
        const allFilters = getAllFilters();
        const currentIndex = allFilters.findIndex(f => f.id === filter.id);
        const lastIndex = allFilters.findIndex(f => f.id === lastSelectedFilter);
        
        // Получаем диапазон фильтров между текущим и последним выбранным
        const start = Math.min(currentIndex, lastIndex);
        const end = Math.max(currentIndex, lastIndex);
        
        const filterRange = allFilters.slice(start, end + 1);
        
        // Добавляем все фильтры из диапазона
        filterRange.forEach(f => {
          if (!newFilters.includes(f.id)) {
            newFilters.push(f.id);
          }
        });
      }
      // Если зажат Ctrl/Cmd
      else if (event.ctrlKey || event.metaKey) {
        if (isSelected) {
          newFilters = newFilters.filter(id => id !== filter.id);
        } else {
          newFilters.push(filter.id);
        }
      }
      // Обычный клик
      else {
        if (isSelected) {
          newFilters = newFilters.filter(id => id !== filter.id);
        } else {
          newFilters = [filter.id];
        }
      }

      setLastSelectedFilter(filter.id);
      return newFilters;
    });
  }, [lastSelectedFilter, getAllFilters]);

  const clearAll = () => {
    setSelectedFilters([]);
    setLastSelectedFilter(null);
  };

  // Получаем выбранные фильтры с их данными для отображения
  const getSelectedFilterData = () => {
    const selected = [];
    Object.values(filterGroups).forEach(group => {
      group.filters.forEach(filter => {
        if (selectedFilters.includes(filter.id)) {
          selected.push(filter);
        }
      });
    });
    return selected;
  };

  const selectedFiltersData = getSelectedFilterData();

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      {selectedFiltersData.length > 0 && (
        <div className="mb-4 sticky top-0 bg-gray-50 z-10 pb-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Выбранные фильтры
              {isMultiSelectMode && (
                <span className="ml-2 text-blue-600">(Режим мультивыбора)</span>
              )}
            </span>
            <button 
              onClick={clearAll}
              className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Сбросить все
            </button>
          </div>
          <div className="overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {selectedFiltersData.map(filter => (
                <FilterBadge
                  key={filter.id}
                  label={filter.label}
                  count={filter.count}
                  isActive={true}
                  isMultiSelectMode={isMultiSelectMode}
                  onClick={(e) => handleFilterToggle(filter, e)}
                  onRemove={() => handleFilterToggle(filter, {})}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {Object.entries(filterGroups).map(([key, group]) => (
          <FilterGroup
            key={key}
            title={group.title}
            filters={group.filters}
            selectedFilters={selectedFilters}
            onFilterToggle={handleFilterToggle}
            isMultiSelectMode={isMultiSelectMode}
          />
        ))}
      </div>
    </div>
  );
};

Filters.propTypes = {
  filterGroups: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      filters: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
          count: PropTypes.number,
        })
      ).isRequired,
    })
  ).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  storageKey: PropTypes.string,
};

export default Filters;
