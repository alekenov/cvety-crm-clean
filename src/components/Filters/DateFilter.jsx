import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useState } from 'react';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';

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
    onChange(value === newValue ? 'all' : newValue);
  };

  const handleDateSelect = (date) => {
    onDateSelect(date);
    setIsCalendarOpen(false);
    onChange('custom');
  };

  return (
    <FilterGroup icon={CalendarIcon} title="Фильтры по дате">
      {options.map((option) => (
        <FilterButton
          key={option.id}
          active={value === option.id}
          onClick={() => handleChange(option.id)}
        >
          {option.label}
        </FilterButton>
      ))}
      
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              value === 'custom'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {value === 'custom' && selectedDate
              ? format(selectedDate, 'd MMMM', { locale: ru })
              : 'Выбрать дату'}
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
    </FilterGroup>
  );
};

export default DateFilter;
