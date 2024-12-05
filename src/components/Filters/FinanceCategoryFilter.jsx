import React from 'react';
import { FolderOpen } from 'lucide-react';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';

const CATEGORIES = {
  income: [
    { id: 'all', label: 'Все' },
    { id: 'orders', label: 'Заказы' },
    { id: 'retail', label: 'Розница' },
    { id: 'online', label: 'Онлайн продажи' },
    { id: 'events', label: 'Мероприятия' },
    { id: 'other_income', label: 'Другое' }
  ],
  expense: [
    { id: 'all', label: 'Все' },
    { id: 'flowers', label: 'Закуп цветов' },
    { id: 'materials', label: 'Материалы' },
    { id: 'salary', label: 'Зарплата' },
    { id: 'rent', label: 'Аренда' },
    { id: 'utilities', label: 'Коммунальные услуги' },
    { id: 'marketing', label: 'Маркетинг' },
    { id: 'delivery', label: 'Доставка' },
    { id: 'other_expense', label: 'Другое' }
  ]
};

export default function FinanceCategoryFilter({ selectedCategory, onCategoryChange, operationType = 'all' }) {
  const handleChange = (newCategory) => {
    onCategoryChange(selectedCategory === newCategory ? 'all' : newCategory);
  };

  const categories = operationType === 'all' 
    ? [{ id: 'all', label: 'Все категории' }]
    : CATEGORIES[operationType] || [];

  return (
    <FilterGroup icon={FolderOpen} title="Категория">
      {categories.map((category) => (
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
