import { colors, alpha } from './colors';

export const shadows = {
  // Легкие тени
  light: {
    xs: `0 1px 2px 0 ${alpha(colors.neutral[900], 0.05)}`,
    sm: `0 1px 3px 0 ${alpha(colors.neutral[900], 0.1)}, 0 1px 2px -1px ${alpha(colors.neutral[900], 0.1)}`,
    md: `0 4px 6px -1px ${alpha(colors.neutral[900], 0.1)}, 0 2px 4px -2px ${alpha(colors.neutral[900], 0.1)}`,
    lg: `0 10px 15px -3px ${alpha(colors.neutral[900], 0.1)}, 0 4px 6px -4px ${alpha(colors.neutral[900], 0.1)}`,
    xl: `0 20px 25px -5px ${alpha(colors.neutral[900], 0.1)}, 0 10px 10px -5px ${alpha(colors.neutral[900], 0.04)}`
  },

  // Темные тени
  dark: {
    xs: `0 1px 2px 0 ${alpha(colors.neutral[900], 0.1)}`,
    sm: `0 1px 3px 0 ${alpha(colors.neutral[900], 0.2)}, 0 1px 2px -1px ${alpha(colors.neutral[900], 0.2)}`,
    md: `0 4px 6px -1px ${alpha(colors.neutral[900], 0.2)}, 0 2px 4px -2px ${alpha(colors.neutral[900], 0.2)}`,
    lg: `0 10px 15px -3px ${alpha(colors.neutral[900], 0.2)}, 0 4px 6px -4px ${alpha(colors.neutral[900], 0.2)}`,
    xl: `0 20px 25px -5px ${alpha(colors.neutral[900], 0.2)}, 0 10px 10px -5px ${alpha(colors.neutral[900], 0.1)}`
  },

  // Цветные тени
  colored: {
    primary: `0 4px 6px -1px ${alpha(colors.primary[500], 0.2)}, 0 2px 4px -2px ${alpha(colors.primary[500], 0.1)}`,
    success: `0 4px 6px -1px ${alpha(colors.semantic.success, 0.2)}, 0 2px 4px -2px ${alpha(colors.semantic.success, 0.1)}`,
    error: `0 4px 6px -1px ${alpha(colors.semantic.error, 0.2)}, 0 2px 4px -2px ${alpha(colors.semantic.error, 0.1)}`,
    warning: `0 4px 6px -1px ${alpha(colors.semantic.warning, 0.2)}, 0 2px 4px -2px ${alpha(colors.semantic.warning, 0.1)}`
  },

  // Специальные тени
  special: {
    // Тень для выпадающих меню и попапов
    dropdown: `0 10px 15px -3px ${alpha(colors.neutral[900], 0.1)}, 0 4px 6px -4px ${alpha(colors.neutral[900], 0.05)}`,
    
    // Тень для модальных окон
    modal: `0 25px 50px -12px ${alpha(colors.neutral[900], 0.25)}`,
    
    // Тень для карточек с hover эффектом
    hover: `0 10px 15px -3px ${alpha(colors.primary[500], 0.15)}, 0 4px 6px -4px ${alpha(colors.primary[500], 0.1)}`
  }
};
