import { Tag } from 'lucide-react';

const ORDER_STATUSES = [
  'Не оплачен',
  'Оплачен',
  'В работе',
  'Собран',
  'В пути',
  'Готов к самовывозу',
  'Доставлен',
  'Архив'
];

const StatusFilter = ({ selectedStatus, onStatusChange }) => {
  const handleChange = (newStatus) => {
    // Если кликнули на текущий фильтр, сбрасываем на "Все статусы"
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
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              selectedStatus === status
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilter;
