import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../services/api/orders';

export function useOrders() {
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.fetchOrders,
    select: (data) => ordersApi.groupOrdersByDate(data)
  });

  return {
    orders,
    isLoading,
    error
  };
} 