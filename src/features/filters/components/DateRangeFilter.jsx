import React from 'react';
import PropTypes from 'prop-types';
import { Calendar } from '@/components/ui/calendar';
import { Popover } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const DateRangeFilter = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  onClear,
  label 
}) => {
  const formatDate = (date) => {
    if (!date) return '';
    return format(date, 'd MMM yyyy', { locale: ru });
  };

  const isDateSelected = startDate || endDate;

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <Popover>
          <Popover.Trigger asChild>
            <Button
              variant={startDate ? "primary" : "outline"}
              className="justify-start text-left font-normal w-[130px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? formatDate(startDate) : "От"}
            </Button>
          </Popover.Trigger>
          <Popover.Content className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
            />
          </Popover.Content>
        </Popover>

        <span className="text-gray-500">—</span>

        <Popover>
          <Popover.Trigger asChild>
            <Button
              variant={endDate ? "primary" : "outline"}
              className="justify-start text-left font-normal w-[130px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? formatDate(endDate) : "До"}
            </Button>
          </Popover.Trigger>
          <Popover.Content className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              initialFocus
            />
          </Popover.Content>
        </Popover>

        {isDateSelected && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-9 w-9"
            aria-label="Очистить выбор дат"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

DateRangeFilter.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default DateRangeFilter;
