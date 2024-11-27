import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './products/productsSlice';
import clientsReducer from './clients/clientsSlice';
import ordersReducer from './orders/ordersSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    clients: clientsReducer,
    orders: ordersReducer,
    // другие редьюсеры...
  }
});

export default store; 