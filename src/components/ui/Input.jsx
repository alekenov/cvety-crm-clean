import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, X, AlertCircle } from "lucide-react"

export const Input = React.forwardRef(({
  className,
  type = "text",
  variant = "default",
  size = "md",
  leftIcon,
  rightIcon,
  error,
  clearable = false,
  onClear,
  ...props
}, ref) => {
  const [inputValue, setInputValue] = React.useState(props.value || '')

  const handleClear = () => {
    setInputValue('')
    onClear && onClear()
  }

  const variants = {
    default: "border border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
    outlined: "border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
    ghost: "border-none bg-transparent",
    error: "border border-red-500 focus:ring-2 focus:ring-red-100"
  }

  const sizes = {
    sm: "px-2 py-1 text-sm rounded-md",
    md: "px-3 py-2 text-base rounded-lg",
    lg: "px-4 py-3 text-lg rounded-xl"
  }

  const renderIcon = (icon, position) => (
    <div className={`absolute inset-y-0 ${position}-0 px-3 flex items-center pointer-events-none`}>
      {icon}
    </div>
  )

  return (
    <div className="relative w-full">
      {leftIcon && renderIcon(leftIcon, 'left')}
      
      <input
        ref={ref}
        type={type}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          props.onChange && props.onChange(e)
        }}
        className={cn(
          'w-full',
          'transition-all duration-200',
          'focus:outline-none',
          variants[error ? 'error' : variant],
          sizes[size],
          leftIcon && 'pl-10',
          (rightIcon || (clearable && inputValue)) && 'pr-10',
          className
        )}
        {...props}
      />
      
      {rightIcon && renderIcon(rightIcon, 'right')}
      
      {clearable && inputValue && (
        <button 
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-700"
        >
          <X size={16} />
        </button>
      )}

      {error && (
        <div className="flex items-center mt-1 text-sm text-red-500 space-x-1">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Создаем под-компоненты для удобства
export const SearchInput = React.forwardRef((props, ref) => (
  <Input 
    ref={ref} 
    leftIcon={<Search size={16} className="text-neutral-500" />} 
    {...props} 
  />
))
SearchInput.displayName = 'SearchInput'
