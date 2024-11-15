import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, Store, User } from 'lucide-react';
import Button from '../../components/ui/Button/Button';
import Badge from '../../components/ui/Badge/Badge';

function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (*)
          ),
          store:stores (*)
        `)
        .eq('number', id)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (!order) return <div>Заказ не найден</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Хедер */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Заказ №{order.number}</h1>
        </div>

        <div className="flex justify-between items-center">
          <Badge variant={order.status === 'Новый' ? 'danger' : 'primary'}>
            {order.status}
          </Badge>
          <span className="font-semibold text-green-600">
            {order.total_price.toLocaleString()} ₸
          </span>
        </div>
      </div>

      {/* Информация о заказе */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Clock size={20} className="mr-2" />
            {order.delivery_time}
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin size={20} className="mr-2" />
            {order.delivery_address}
          </div>
          <div className="flex items-center text-gray-600">
            <Phone size={20} className="mr-2" />
            {order.client_phone}
          </div>
        </div>
      </div>

      {/* Состав заказа */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h2 className="font-medium mb-4">Состав заказа:</h2>
        <div className="space-y-3">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <img 
                  src={item.product.image_url || '/placeholder.jpg'} 
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg mr-3"
                />
                <div>
                  <div className="font-medium">{item.product.name}</div>
                  <div className="text-sm text-gray-500">{item.product.category}</div>
                </div>
              </div>
              <div className="font-medium">
                {item.price.toLocaleString()} ₸
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderPage; 