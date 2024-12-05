import React from 'react';
import { Tag } from 'lucide-react';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';

const PRODUCT_CATEGORIES = [
  { id: 'all', label: 'Все товары' },
  { id: 'bouquets', label: 'Букеты' },
  { id: 'flowers', label: 'Цветы' },
  { id: 'plants', label: 'Растения' },
  { id: 'accessories', label: 'Аксессуары' },
];

export default function ProductCategoryFilter({ selectedCategory, onCategoryChange }) {
  const handleChange = (newCategory) => {
    onCategoryChange(selectedCategory === newCategory ? 'all' : newCategory);
  };

  return (
    <FilterGroup icon={Tag} title="Категории">
      {PRODUCT_CATEGORIES.map((category) => (
        <FilterButton
          key={category.id}
          active={selectedCategory === category.id}
          onClick={() => handleChange(category.id)}
        >
          {category.label}
        </FilterButton>
      ))}
    </FilterGroup>
  );
}
