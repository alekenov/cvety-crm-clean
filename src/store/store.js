import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './products/productsSlice';
import clientsReducer from './clients/clientsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    clients: clientsReducer,
    // другие редьюсеры...
  }
});

export default store; 