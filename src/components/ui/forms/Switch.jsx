import React from 'react'
import { cn } from '@/lib/utils'

export const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <label 
      className={cn(
        'inline-flex items-center cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange && onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
          {...props}
        />
        <div 
          className={cn(
            'w-10 h-6 rounded-full transition-colors duration-300',
            checked ? 'bg-blue-500' : 'bg-neutral-300',
            disabled && 'bg-neutral-200'
          )}
        />
        <div 
          className={cn(
            'absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300',
            checked ? 'translate-x-4' : 'translate-x-0'
          )}
        />
      </div>
      {label && (
        <span className="ml-2 text-sm text-neutral-700">
          {label}
        </span>
      )}
    </label>
  )
}

Switch.displayName = 'Switch'
