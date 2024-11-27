import * as React from "react"
import { cn } from "@/lib/utils"
import { colors } from "./tokens/colors"
import { shadows } from "./tokens/shadows"

export const Card = React.forwardRef(({
  className,
  variant = 'default',
  elevation = 'sm',
  hover = false,
  children,
  ...props
}, ref) => {
  const variants = {
    default: `bg-neutral-50 border border-neutral-200`,
    outlined: `border border-blue-300 bg-white`,
    elevated: `bg-white shadow-md`,
    ghost: 'bg-transparent border-none'
  }

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl p-4 transition-all duration-300',
        variants[variant],
        shadows.light[elevation],
        hover && `hover:shadow-lg hover:scale-[1.02]`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

// Sub-components
export const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'flex items-center justify-between mb-4 border-b pb-2', 
      `border-neutral-200`,
      className
    )} 
    {...props}
  >
    {children}
  </div>
))
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3 
    ref={ref}
    className={cn(
      'text-lg font-semibold', 
      `text-neutral-900`,
      className
    )} 
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-neutral-500", className)}
    {...props}
  >
    {children}
  </p>
))
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'py-2', 
      className
    )} 
    {...props}
  >
    {children}
  </div>
))
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div 
    ref={ref}
    className={cn(
      'flex items-center justify-end mt-4 pt-2', 
      `border-t border-neutral-200`,
      className
    )} 
    {...props}
  >
    {children}
  </div>
))
CardFooter.displayName = "CardFooter"

// Добавляем под-компоненты к основному компоненту
Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter
