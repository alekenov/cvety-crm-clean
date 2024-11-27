import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import { Check, ChevronDown, X } from 'lucide-react'

export const Select = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (selectedValue) => {
    onChange(selectedValue)
    setIsOpen(false)
  }

  return (
    <div className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        {value ? 
          options.find(opt => opt.value === value)?.label || placeholder 
          : placeholder
        }
        <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 hover:bg-accent cursor-pointer flex items-center justify-between"
            >
              {option.label}
              {value === option.value && <Check size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const MultiSelect = ({ 
  options, 
  value = [], 
  onChange, 
  placeholder = "Select...", 
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (selectedValue) => {
    const newValue = value.includes(selectedValue)
      ? value.filter(v => v !== selectedValue)
      : [...value, selectedValue]
    onChange(newValue)
  }

  const removeValue = (valueToRemove) => {
    onChange(value.filter(v => v !== valueToRemove))
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div 
        className="flex w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length > 0 ? (
          value.map(selectedValue => {
            const selectedOption = options.find(opt => opt.value === selectedValue)
            return (
              <div 
                key={selectedValue} 
                className="flex items-center bg-accent rounded-md px-2 py-1 text-xs"
              >
                {selectedOption?.label}
                <X 
                  size={12} 
                  className="ml-1 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation()
                    removeValue(selectedValue)
                  }} 
                />
              </div>
            )
          })
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown size={16} className="ml-auto" />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="px-3 py-2 hover:bg-accent cursor-pointer flex items-center justify-between"
            >
              {option.label}
              {value.includes(option.value) && <Check size={16} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

Select.displayName = 'Select'
MultiSelect.displayName = 'MultiSelect'
