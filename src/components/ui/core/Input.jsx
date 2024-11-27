import React, { forwardRef } from 'react'
import { cn } from "@/lib/utils"
import { X } from 'lucide-react'

const Input = forwardRef(({ 
  className, 
  type, 
  clearable = false, 
  onClear, 
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      {clearable && props.value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
})

const SearchInput = forwardRef(({ 
  className, 
  onSearch, 
  ...props 
}, ref) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(e.target.value)
    }
  }

  return (
    <Input
      ref={ref}
      type="search"
      className={cn("pr-10", className)}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
})

Input.displayName = 'Input'
SearchInput.displayName = 'SearchInput'

export { Input, SearchInput }
