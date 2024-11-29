import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';

const DateFilter = ({ value, onChange, selectedDate, onDateSelect }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

  const handleDateSelect = (date) => {
    onDateSelect(date);
    setIsCalendarOpen(false);
    onChange('custom');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <CalendarIcon size={20} />
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
        
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button
              className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2 ${
                value === 'custom'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <CalendarIcon size={16} />
              {value === 'custom' && selectedDate 
                ? format(selectedDate, 'd MMMM', { locale: ru })
                : ''}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              locale={ru}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DateFilter;
