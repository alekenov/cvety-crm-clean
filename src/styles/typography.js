// Константы для типографики
export const TYPOGRAPHY = {
  // Размеры заголовков
  h1: 'text-3xl md:text-4xl font-bold tracking-tight',
  h2: 'text-2xl md:text-3xl font-semibold tracking-tight',
  h3: 'text-xl md:text-2xl font-semibold tracking-tight',
  h4: 'text-lg md:text-xl font-medium',
  
  // Основной текст
  body: {
    lg: 'text-lg leading-7',
    base: 'text-base leading-6',
    sm: 'text-sm leading-5',
    xs: 'text-xs leading-4',
  },
  
  // Специальные стили
  label: 'text-sm font-medium text-gray-700',
  caption: 'text-xs text-gray-500',
  
  // Состояния текста
  states: {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    disabled: 'text-gray-400',
  }
};

// Константы для межстрочных интервалов
export const LINE_HEIGHT = {
  tight: 'leading-tight', // 1.25
  snug: 'leading-snug',  // 1.375
  normal: 'leading-normal', // 1.5
  relaxed: 'leading-relaxed', // 1.625
  loose: 'leading-loose',  // 2
};

// Веса шрифтов
export const FONT_WEIGHT = {
  light: 'font-light',     // 300
  normal: 'font-normal',   // 400
  medium: 'font-medium',   // 500
  semibold: 'font-semibold', // 600
  bold: 'font-bold',       // 700
};
