import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { colors } from './tokens/colors'

export const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  isLoading = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    primary: `bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-200`,
    secondary: `bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-300`,
    outline: `border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-100`,
    danger: `bg-red-500 text-white hover:bg-red-600 focus:ring-red-200`,
    ghost: `text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-200`
  }

  const sizes = {
    lg: "h-12 px-6 text-lg rounded-lg", 
    md: "h-10 px-4 rounded-lg",
    sm: "h-8 px-3 text-sm rounded-md",
    icon: "p-2 w-10 h-10 justify-center"
  }

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        isLoading && "relative text-transparent transition-none hover:text-transparent",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-current" />
        </div>
      ) : null}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
