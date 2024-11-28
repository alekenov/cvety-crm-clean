import { Filter, Package, Flower2, Clock, Star } from 'lucide-react';

const TypeFilter = ({ value, onChange }) => {
  const options = [
    { id: 'bouquets', label: 'Букеты', icon: Package },
    { id: 'roses', label: 'Розы', icon: Flower2 },
    { id: 'urgent', label: 'Срочно', icon: Clock },
    { id: 'vip', label: 'VIP', icon: Star },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Filter size={20} />
        <span className="font-medium">Фильтры по типу</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${
                value === option.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Icon size={16} />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TypeFilter;
