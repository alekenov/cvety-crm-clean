import React from 'react';
import PropTypes from 'prop-types';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const SelectFilter = ({
  value,
  onChange,
  onClear,
  options,
  label,
  placeholder = 'Выберите значение'
}) => {
  const isSelected = value !== null && value !== undefined;

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <Select
          value={value}
          onValueChange={onChange}
          className="w-[200px]"
        >
          <Select.Trigger>
            <Select.Value placeholder={placeholder} />
          </Select.Trigger>
          <Select.Content>
            {options.map(option => (
              <Select.Item
                key={option.value}
                value={option.value}
              >
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>

        {isSelected && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-9 w-9"
            aria-label="Очистить выбор"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

SelectFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

export default SelectFilter;
