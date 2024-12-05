import React from 'react';
import { Receipt } from 'lucide-react';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';

const OPERATION_TYPES = [
  { id: 'all', label: 'Все операции' },
  { id: 'income', label: 'Доходы' },
  { id: 'expense', label: 'Расходы' },
];

const FinanceTypeFilter = React.forwardRef(({ selectedType, onTypeChange }, ref) => {
  const handleChange = (newType) => {
    onTypeChange(selectedType === newType ? 'all' : newType);
  };

  return (
    <FilterGroup icon={Receipt} title="Тип операции">
      {OPERATION_TYPES.map((type) => (
        <FilterButton
          key={type.id}
          active={selectedType === type.id}
          onClick={() => handleChange(type.id)}
          variant={type.id === 'income' ? 'success' : type.id === 'expense' ? 'danger' : 'default'}
        >
          {type.label}
        </FilterButton>
      ))}
    </FilterGroup>
  );
});

FinanceTypeFilter.displayName = 'FinanceTypeFilter';

export default FinanceTypeFilter;
