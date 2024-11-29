import React from 'react';
import { Tag } from 'lucide-react';

const ORDER_STATUSES = [
  'Все заказы',
  'Не оплачен',
  'Оплачен',
  'В работе',
  'Собран',
  'В пути',
  'Готов к самовывозу',
  'Архив'
];

export default function StatusFilter({ selectedStatus, onStatusChange }) {
  const handleChange = (newStatus) => {
    onStatusChange(selectedStatus === newStatus ? null : newStatus);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tag size={20} />
        <span className="font-medium">Фильтр по статусу</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {ORDER_STATUSES.map((status) => (
          <button 
            key={status}
            onClick={() => handleChange(status)}
            className={`px-4 py-2 rounded-full ${
              selectedStatus === status 
                ? status === 'Архив'
                  ? 'bg-gray-500 text-white'
                  : 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
