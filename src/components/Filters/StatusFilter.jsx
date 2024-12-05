import React from 'react';
import { Tag } from 'lucide-react';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';

const ORDER_STATUSES = [
  { id: 'all', label: 'Все заказы', variant: 'default' },
  { id: 'unpaid', label: 'Не оплачен', variant: 'danger' },
  { id: 'paid', label: 'Оплачен', variant: 'success' },
  { id: 'in_progress', label: 'В работе', variant: 'default' },
  { id: 'assembled', label: 'Собран', variant: 'default' },
  { id: 'in_delivery', label: 'В пути', variant: 'default' },
  { id: 'ready_for_pickup', label: 'Готов к самовывозу', variant: 'success' },
  { id: 'archived', label: 'Архив', variant: 'default' }
];

export default function StatusFilter({ selectedStatus, onStatusChange }) {
  const handleChange = (newStatus) => {
    onStatusChange(selectedStatus === newStatus ? null : newStatus);
  };

  return (
    <FilterGroup icon={Tag} title="Фильтр по статусу">
      {ORDER_STATUSES.map((status) => (
        <FilterButton
          key={status.id}
          active={selectedStatus === status.id}
          onClick={() => handleChange(status.id)}
          variant={status.variant}
        >
          {status.label}
        </FilterButton>
      ))}
    </FilterGroup>
  );
}
