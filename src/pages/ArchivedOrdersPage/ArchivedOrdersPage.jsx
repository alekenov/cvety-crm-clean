import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersService } from '../../services/ordersService';
import { OrderCard } from '../../components/OrderCard/OrderCard';
import { Button } from '../../components/ui/Button';
import { Loader } from '../../components/ui/Loader';
import logger from '../../utils/logger';

export function ArchivedOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArchivedOrders();
  }, []);

  const loadArchivedOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersService.fetchArchivedOrders();
      
      if (response && response.data && Array.isArray(response.data)) {
        setOrders(response.data);
        setError(null);
      } else if (response.error) {
        throw new Error(response.error);
      } else {
        throw new Error('Получены некорректные данные от сервера');
      }
    } catch (err) {
      console.error('Error loading archived orders:', err);
      setError(err);
      logger.error('[ArchivedOrdersPage] Ошибка при загрузке архива заказов', {
        error: err.message || err,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Архив заказов</h1>
        <div className="text-red-500">
          Произошла ошибка при загрузке архива заказов: {error.message}
        </div>
        <Button onClick={loadArchivedOrders} className="mt-4">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Архив заказов</h1>
        <Link to="/orders">
          <Button variant="outline">
            Активные заказы
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          В архиве пока нет заказов
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              readonly={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
