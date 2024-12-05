import React from 'react';
import { FileText } from 'lucide-react';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';

const DOCUMENT_STATUSES = [
  { id: 'all', label: 'Все' },
  { id: 'with_docs', label: 'С документами' },
  { id: 'without_docs', label: 'Без документов' },
];

export default function FinanceDocumentFilter({ selectedStatus, onStatusChange }) {
  const handleChange = (newStatus) => {
    onStatusChange(selectedStatus === newStatus ? 'all' : newStatus);
  };

  return (
    <FilterGroup icon={FileText} title="Документы">
      {DOCUMENT_STATUSES.map((status) => (
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
