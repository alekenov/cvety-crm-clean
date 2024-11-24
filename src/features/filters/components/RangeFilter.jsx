import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const RangeFilter = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  onClear,
  label,
  prefix = '',
  suffix = '',
  step = 1
}) => {
  const [localMin, setLocalMin] = useState(minValue?.toString() || '');
  const [localMax, setLocalMax] = useState(maxValue?.toString() || '');

  useEffect(() => {
    setLocalMin(minValue?.toString() || '');
    setLocalMax(maxValue?.toString() || '');
  }, [minValue, maxValue]);

  const handleMinChange = (e) => {
    const value = e.target.value;
    setLocalMin(value);
    if (value === '') {
      onMinChange(null);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        onMinChange(numValue);
      }
    }
  };

  const handleMaxChange = (e) => {
    const value = e.target.value;
    setLocalMax(value);
    if (value === '') {
      onMaxChange(null);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        onMaxChange(numValue);
      }
    }
  };

  const isRangeSelected = minValue !== null || maxValue !== null;

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {prefix}
            </span>
          )}
          <Input
            type="number"
            value={localMin}
            onChange={handleMinChange}
            placeholder="От"
            className={`w-[100px] ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
            step={step}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {suffix}
            </span>
          )}
        </div>

        <span className="text-gray-500">—</span>

        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {prefix}
            </span>
          )}
          <Input
            type="number"
            value={localMax}
            onChange={handleMaxChange}
            placeholder="До"
            className={`w-[100px] ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-8' : ''}`}
            step={step}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {suffix}
            </span>
          )}
        </div>

        {isRangeSelected && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-9 w-9"
            aria-label="Очистить диапазон"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

RangeFilter.propTypes = {
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  onMinChange: PropTypes.func.isRequired,
  onMaxChange: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  step: PropTypes.number,
};

export default RangeFilter;
