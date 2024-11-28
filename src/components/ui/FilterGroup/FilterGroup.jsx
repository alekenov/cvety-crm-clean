import React from 'react';
import { Button } from '@/components/ui/button';
import { Body } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

export const FilterGroup = ({ 
  label,
  options,
  value,
  onChange,
  multiple = false,
  size = 'sm',
  orientation = 'vertical',
  className
}) => {
  const handleOptionClick = (optionValue) => {
    if (multiple) {
      // Для множественного выбора
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      // Для одиночного выбора
      onChange(value === optionValue ? null : optionValue);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Body size="sm" className="font-medium mb-2">{label}</Body>}
      <div className={cn(
        'flex gap-2',
        orientation === 'vertical' ? 'flex-col' : 'flex-wrap'
      )}>
        {options.map(option => (
          <Button
            key={option.value}
            variant={value === option.value ? 'primary' : 'outline'}
            size={size}
            onClick={() => handleOptionClick(option.value)}
            className={cn(
              'justify-start',
              option.icon && 'space-x-2'
            )}
          >
            {option.icon && <span className="w-4 h-4">{option.icon}</span>}
            <span>{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
