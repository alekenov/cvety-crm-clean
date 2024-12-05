import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const PERIOD_OPTIONS = [
  { id: 'today', label: 'Сегодня' },
  { id: 'yesterday', label: 'Вчера' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
];

export default function FinancePeriodFilter({ selectedPeriod, onPeriodChange, customDate, onCustomDateChange }) {
  const handleChange = (newPeriod) => {
    onPeriodChange(selectedPeriod === newPeriod ? 'all' : newPeriod);
  };

  return (
    <FilterGroup icon={CalendarIcon} title="Период">
      {PERIOD_OPTIONS.map((period) => (
        <FilterButton
          key={period.id}
          active={selectedPeriod === period.id}
          onClick={() => handleChange(period.id)}
        >
          {period.label}
        </FilterButton>
      ))}
      
      <Popover>
        <PopoverTrigger asChild>
          <FilterButton active={selectedPeriod === 'custom'}>
            {selectedPeriod === 'custom' && customDate 
              ? format(customDate, 'd MMMM', { locale: ru })
              : 'Выбрать дату'}
          </FilterButton>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={customDate}
            onSelect={(date) => {
              onCustomDateChange(date);
              onPeriodChange('custom');
            }}
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </FilterGroup>
  );
}
