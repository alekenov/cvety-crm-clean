import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import MediaUpload from '@/components/MediaUpload';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const NewOperationModal = ({ isOpen, onClose, onSave }) => {
  const [operation, setOperation] = useState({
    type: 'income',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    files: [],
    order_id: ''
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      if (operation.type === 'income' && operation.category === 'orders') {
        try {
          setLoadingOrders(true);
          const { data, error } = await supabase
            .from('orders')
            .select('id, client_name, total_amount, status')
            .order('created_at', { ascending: false })
            .limit(50);

          if (error) throw error;
          setOrders(data || []);
        } catch (error) {
          console.error('Error loading orders:', error);
        } finally {
          setLoadingOrders(false);
        }
      }
    };

    loadOrders();
  }, [operation.type, operation.category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(operation);
    onClose();
  };

  const handleChange = (field) => (e) => {
    setOperation(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleFileUpload = (files) => {
    setOperation(prev => ({
      ...prev,
      files: files
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Новая операция" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Тип операции */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={operation.type === 'income' ? 'primary' : 'outline'}
            className="w-full"
            onClick={() => setOperation(prev => ({ ...prev, type: 'income', category: '', order_id: '' }))}
          >
            Доход
          </Button>
          <Button
            type="button"
            variant={operation.type === 'expense' ? 'primary' : 'outline'}
            className="w-full"
            onClick={() => setOperation(prev => ({ ...prev, type: 'expense', category: '', order_id: '' }))}
          >
            Расход
          </Button>
        </div>

        {/* Основные поля */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Категория</label>
            <Select
              value={operation.category}
              onChange={handleChange('category')}
              className="mt-1"
            >
              <option value="">Выберите категорию</option>
              {operation.type === 'income' ? (
                <>
                  <option value="orders">Заказы</option>
                  <option value="retail">Розница</option>
                  <option value="online">Онлайн продажи</option>
                  <option value="events">Мероприятия</option>
                  <option value="other_income">Другое</option>
                </>
              ) : (
                <>
                  <option value="flowers">Закуп цветов</option>
                  <option value="materials">Материалы</option>
                  <option value="salary">Зарплата</option>
                  <option value="rent">Аренда</option>
                  <option value="utilities">Коммунальные услуги</option>
                  <option value="marketing">Маркетинг</option>
                  <option value="delivery">Доставка</option>
                  <option value="other_expense">Другое</option>
                </>
              )}
            </Select>
          </div>

          {operation.type === 'income' && operation.category === 'orders' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Связанный заказ</label>
              <Select
                value={operation.order_id}
                onChange={handleChange('order_id')}
                className="mt-1"
                disabled={loadingOrders}
              >
                <option value="">Выберите заказ</option>
                {orders.map(order => (
                  <option key={order.id} value={order.id}>
                    {order.client_name} - {order.status} ({order.total_amount.toLocaleString()} ₸)
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Сумма</label>
            <Input
              type="number"
              value={operation.amount}
              onChange={handleChange('amount')}
              className="mt-1"
              placeholder="Введите сумму"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <Input
              value={operation.description}
              onChange={handleChange('description')}
              className="mt-1"
              placeholder="Введите описание"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Дата</label>
            <Input
              type="date"
              value={operation.date}
              onChange={handleChange('date')}
              className="mt-1"
              required
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary">
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewOperationModal;
