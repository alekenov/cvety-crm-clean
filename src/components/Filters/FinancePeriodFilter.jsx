import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const PERIOD_OPTIONS = [
  { id: 'today', label: 'Сегодня' },
  { id: 'yesterday', label: 'Вчера' },
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
];

const CustomDateButton = React.forwardRef(({ onClick, customDate, isActive }, ref) => (
  <FilterButton
    ref={ref}
    onClick={onClick}
    active={isActive}
  >
    {isActive && customDate 
      ? format(customDate, 'd MMMM', { locale: ru })
      : 'Выбрать дату'}
  </FilterButton>
));

CustomDateButton.displayName = 'CustomDateButton';

const FinancePeriodFilter = ({ selectedPeriod, onPeriodChange, customDate, onCustomDateChange }) => {
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
          <CustomDateButton
            customDate={customDate}
            isActive={selectedPeriod === 'custom'}
          />
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
};

FinancePeriodFilter.displayName = 'FinancePeriodFilter';

export default FinancePeriodFilter;
