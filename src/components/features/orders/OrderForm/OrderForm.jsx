import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Input from '../../../ui/Input/Input';
import Select from '../../../ui/Select/Select';
import Button from '../../../ui/Button/Button';

const OrderForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    clientName: initialData?.clientName || '',
    phone: initialData?.phone || '',
    deliveryAddress: initialData?.deliveryAddress || '',
    deliveryDate: initialData?.deliveryDate || '',
    status: initialData?.status || 'new',
    products: initialData?.products || [],
    comment: initialData?.comment || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const statusOptions = [
    { value: 'new', label: 'Новый' },
    { value: 'pending', label: 'В обработке' },
    { value: 'completed', label: 'Выполнен' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Имя клиента"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          required
        />
        <Input
          label="Телефон"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Адрес доставки"
        name="deliveryAddress"
        value={formData.deliveryAddress}
        onChange={handleChange}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Дата доставки"
          name="deliveryDate"
          type="datetime-local"
          value={formData.deliveryDate}
          onChange={handleChange}
          required
        />
        <Select
          label="Статус"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />
      </div>

      <Input
        label="Комментарий"
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        multiline
      />

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit">
          {initialData ? 'Сохранить' : 'Создать заказ'}
        </Button>
      </div>
    </form>
  );
};

export default OrderForm; 