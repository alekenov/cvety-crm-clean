import React, { useState } from 'react'
import { cn } from '@/lib/utils'

export const Tooltip = ({
  children,
  text,
  position = 'top',
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className="relative inline-block group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      {...props}
    >
      {children}
      
      {isVisible && (
        <div 
          className={cn(
            'absolute z-10 px-2 py-1',
            'bg-neutral-800 text-white',
            'text-xs rounded-md',
            'transition-all duration-200',
            'opacity-0 group-hover:opacity-100',
            positionClasses[position],
            className
          )}
        >
          {text}
        </div>
      )}
    </div>
  )
}

Tooltip.displayName = 'Tooltip'
