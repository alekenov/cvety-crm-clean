import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../../../store/orders/ordersSlice';
import OrderCard from '../OrderCard/OrderCard';

// Временные моковые данные
const mockOrders = [
  {
    id: 1,
    clientName: "Анна Иванова",
    products: [
      { id: 1, name: "Розы красные", quantity: 11 },
      { id: 2, name: "Гипсофила", quantity: 1 }
    ],
    totalPrice: 5500,
    status: "pending",
    deliveryDate: "2023-12-25T12:00:00"
  },
  {
    id: 2,
    clientName: "Петр Сидоров",
    products: [
      { id: 3, name: "Тюльпаны", quantity: 15 }
    ],
    totalPrice: 3000,
    status: "new",
    deliveryDate: "2023-12-26T15:00:00"
  }
];

const OrderList = ({ onEditOrder }) => {
  // Временно закомментируем Redux логику
  /*
  const dispatch = useDispatch();
  const { items: orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchOrders());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Загрузка...</div>;
  }

  if (status === 'failed') {
    return <div>Ошибка: {error}</div>;
  }
  */

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {mockOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default OrderList; 