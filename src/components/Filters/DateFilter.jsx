import { Calendar } from 'lucide-react';

const DateFilter = ({ value, onChange }) => {
  const options = [
    { id: 'all', label: 'Все заказы' },
    { id: 'today', label: 'Сегодня' },
    { id: 'tomorrow', label: 'Завтра' },
    { id: 'week', label: 'Эта неделя' },
    { id: 'month', label: 'Этот месяц' },
  ];

  const handleChange = (newValue) => {
    console.log('DateFilter change:', { current: value, new: newValue });
    // Если кликнули на текущий фильтр, сбрасываем на "Все заказы"
    onChange(value === newValue ? 'all' : newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Calendar size={20} />
        <span className="font-medium">Фильтры по дате</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleChange(option.id)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              value === option.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DateFilter;
