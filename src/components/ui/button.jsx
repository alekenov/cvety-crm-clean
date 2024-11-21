import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  isLoading = false,
  disabled,
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    // Основная зеленая кнопка для главных действий
    primary: "bg-green-500 hover:bg-green-600 text-white",
    // Синяя кнопка для вторичных действий
    secondary: "bg-blue-500 hover:bg-blue-600 text-white",
    // Прозрачная кнопка с рамкой
    outline: "border border-gray-200 hover:bg-gray-50 text-gray-600",
    // Красная кнопка для опасных действий
    danger: "text-red-500 hover:bg-red-50",
    // Прозрачная кнопка
    ghost: "text-gray-600 hover:bg-gray-100",
  }

  const sizes = {
    lg: "h-12 px-6 text-lg rounded-lg", // Большие кнопки
    md: "h-10 px-4 rounded-lg",         // Стандартные кнопки
    sm: "h-8 px-3 text-sm rounded-lg",  // Маленькие кнопки
    icon: "w-10 h-10 rounded-full p-2"  // Круглые иконки
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isLoading && "relative text-transparent transition-none hover:text-transparent",
        className
      )}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-current" />
        </div>
      )}
    </button>
  )
})

Button.displayName = "Button"

export { Button }
