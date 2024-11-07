import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slices/clientsSlice';
// импортируйте другие редьюсеры здесь

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    // добавьте другие редьюсеры здесь
  },
}); 