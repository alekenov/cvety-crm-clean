export const colors = {
  // Основная палитра
  primary: {
    50: '#E8F5E9',   // Очень светло-зеленый
    100: '#C8E6C9',  // Светло-зеленый
    300: '#81C784',  // Средне-зеленый
    500: '#4CAF50',  // Основной зеленый
    700: '#388E3C',  // Темно-зеленый
    900: '#1B5E20'   // Очень темно-зеленый
  },

  // Нейтральные оттенки
  neutral: {
    50: '#FAFAFA',   // Почти белый
    100: '#F5F5F5',  // Светло-серый
    200: '#EEEEEE',  // Легкий серый
    300: '#E0E0E0',  // Серый
    400: '#BDBDBD',  // Средне-серый
    500: '#9E9E9E',  // Темно-серый
    700: '#616161',  // Очень темно-серый
    900: '#212121'   // Угольно-черный
  },

  // Акцентные цвета
  accent: {
    pink: '#FF80AB',    // Нежно-розовый
    peach: '#FFD54F',   // Персиковый
    blue: '#2196F3',    // Синий
    red: '#F44336'      // Красный для ошибок
  },

  // Семантические цвета
  semantic: {
    success: '#4CAF50', // Зеленый
    warning: '#FF9800', // Оранжевый
    error: '#F44336',   // Красный
    info: '#2196F3'     // Синий
  },

  // Цвета для текста
  text: {
    primary: '#212121',   // Почти черный
    secondary: '#757575', // Серый
    disabled: '#9E9E9E',  // Светло-серый
    hint: '#BDBDBD'       // Очень светло-серый
  },

  // Фоновые цвета
  background: {
    default: '#FFFFFF',  // Белый
    paper: '#F5F5F5',    // Легкий серый
    dark: '#E0E0E0'      // Средне-серый
  }
};

// Функция для генерации прозрачности
export function alpha(color, opacity) {
  const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16)
        ]
      : null;
  };

  const rgb = hexToRgb(color);
  return rgb 
    ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})` 
    : color;
}
