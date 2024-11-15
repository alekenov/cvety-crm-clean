import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button/Button';

function CreateOrderPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    client_phone: '',
    delivery_address: '',
    delivery_date: '',
    delivery_time: '',
    client_comment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...formData,
          status: 'Новый',
          number: Date.now().toString(), // Временное решение для номера заказа
          total_price: 0 // Будет обновлено после добавления товаров
        }])
        .select()
        .single();

      if (error) throw error;
      navigate(`/order/${data.number}`);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-bold">Новый заказ</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Телефон клиента
            </label>
            <input
              type="tel"
              value={formData.client_phone}
              onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Адрес доставки
            </label>
            <input
              type="text"
              value={formData.delivery_address}
              onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата доставки
              </label>
              <input
                type="date"
                value={formData.delivery_date}
                onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время доставки
              </label>
              <input
                type="time"
                value={formData.delivery_time}
                onChange={(e) => setFormData({...formData, delivery_time: e.target.value})}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Комментарий
            </label>
            <textarea
              value={formData.client_comment}
              onChange={(e) => setFormData({...formData, client_comment: e.target.value})}
              className="w-full p-2 border rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Отмена
            </Button>
            <Button 
              variant="primary"
              type="submit"
            >
              Создать заказ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOrderPage;