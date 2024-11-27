import React from 'react';
import { cn } from "@/lib/utils"
import { typography } from './tokens/typography';
import { colors } from './tokens/colors';

export const Typography = ({ 
  variant = 'body', 
  size = 'base', 
  weight = 'normal', 
  color = 'primary', 
  className, 
  children, 
  ...props 
}) => {
  const variantMap = {
    h1: 'text-4xl font-bold leading-tight',
    h2: 'text-3xl font-semibold leading-tight',
    h3: 'text-2xl font-semibold leading-normal',
    h4: 'text-xl font-medium leading-normal',
    h5: 'text-lg font-medium leading-normal',
    h6: 'text-base font-medium leading-normal',
    body: 'text-base leading-relaxed',
    caption: 'text-sm leading-tight',
    overline: 'text-xs uppercase tracking-wide'
  };

  const sizeMap = {
    xs: typography.fontSize.xs,
    sm: typography.fontSize.sm,
    base: typography.fontSize.base,
    lg: typography.fontSize.lg,
    xl: typography.fontSize.xl
  };

  const weightMap = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const colorMap = {
    primary: `text-${colors.text.primary}`,
    secondary: `text-${colors.text.secondary}`,
    muted: `text-${colors.text.disabled}`,
    white: 'text-white',
    success: `text-${colors.semantic.success}`,
    error: `text-${colors.semantic.error}`,
    warning: `text-${colors.semantic.warning}`
  };

  const Tag = variant.startsWith('h') ? variant : 'p';

  return (
    <Tag
      className={cn(
        'font-sans',
        variantMap[variant],
        `text-[${sizeMap[size]}]`,
        weightMap[weight],
        colorMap[color],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

// Создаем под-компоненты
export const H1 = (props) => <Typography variant="h1" {...props} />
export const H2 = (props) => <Typography variant="h2" {...props} />
export const H3 = (props) => <Typography variant="h3" {...props} />
export const H4 = (props) => <Typography variant="h4" {...props} />
export const H5 = (props) => <Typography variant="h5" {...props} />
export const H6 = (props) => <Typography variant="h6" {...props} />
export const Body = (props) => <Typography variant="body" {...props} />
export const Caption = (props) => <Typography variant="caption" {...props} />
export const Overline = (props) => <Typography variant="overline" {...props} />
