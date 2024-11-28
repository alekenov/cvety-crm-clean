import { Tag } from 'lucide-react';

const StatusFilter = ({ value, onChange, statuses }) => {
  const handleChange = (newValue) => {
    // Если кликнули на текущий фильтр, сбрасываем на "Все статусы"
    onChange(value === newValue ? null : newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tag size={20} />
        <span className="font-medium">Фильтр по статусу</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange(null)}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            value === null
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          Все статусы
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => handleChange(status)}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              value === status
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
