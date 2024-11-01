import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const ordersApi = {
  getOrders: () => axios.get(`${API_URL}/orders`),
  createOrder: (data) => axios.post(`${API_URL}/orders`, data),
  updateOrder: (id, data) => axios.put(`${API_URL}/orders/${id}`, data),
  deleteOrder: (id) => axios.delete(`${API_URL}/orders/${id}`),
}; 