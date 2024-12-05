import React from 'react';
import { Package } from 'lucide-react';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';

const AVAILABILITY_STATUSES = [
  { id: 'all', label: 'Все' },
  { id: 'in_stock', label: 'В наличии' },
  { id: 'out_of_stock', label: 'Нет в наличии' },
  { id: 'low_stock', label: 'Заканчивается' },
];

export default function ProductAvailabilityFilter({ selectedStatus, onStatusChange }) {
  const handleChange = (newStatus) => {
    onStatusChange(selectedStatus === newStatus ? 'all' : newStatus);
  };

  return (
    <FilterGroup icon={Package} title="Наличие">
      {AVAILABILITY_STATUSES.map((status) => (
        <FilterButton
          key={status.id}
          active={selectedStatus === status.id}
          onClick={() => handleChange(status.id)}
        >
          {status.label}
        </FilterButton>
      ))}
    </FilterGroup>
  );
}
