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
  value,
  onChange,
  ...props
}, ref) => {
  const handleChange = (e) => {
    onChange?.(e);
  };

  // Удаляем пропсы, которые не должны попадать в DOM
  const { variant: _, size: __, ...domProps } = props;

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
        type={type}
        ref={ref}
        value={value}
        onChange={handleChange}
        className={cn(
          "w-full bg-white disabled:cursor-not-allowed disabled:opacity-50",
          variants[error ? "error" : variant],
          sizes[size],
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          className
        )}
        {...domProps}
      />

      {rightIcon && renderIcon(rightIcon, 'right')}
      
      {clearable && value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 px-3 flex items-center"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>
      )}

      {error && (
        <div className="flex items-center mt-1 text-red-500 text-sm">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
})

Input.displayName = "Input"

// Создаем под-компоненты для удобства
export const SearchInput = React.forwardRef((props, ref) => (
  <Input 
    ref={ref} 
    leftIcon={<Search size={16} className="text-neutral-500" />} 
    {...props} 
  />
))
SearchInput.displayName = 'SearchInput'
