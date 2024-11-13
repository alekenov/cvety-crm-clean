import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  ...props
}) {
  return (
    <DayPicker
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      className={className}
      {...props}
    />
  );
} 