import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './orders/ordersSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
  },
}); 