import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Button from '../../../ui/Button/Button';

const OrderCard = ({ order }) => {
  const { id, clientName, products, totalPrice, status, deliveryDate } = order;

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium">Заказ #{id}</h3>
          <p className="text-gray-600">{clientName}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-medium">{totalPrice} ₽</p>
          <span className={`inline-block px-2 py-1 rounded-full text-sm ${
            status === 'completed' ? 'bg-green-100 text-green-800' :
            status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {status === 'completed' ? 'Выполнен' :
             status === 'pending' ? 'В обработке' : 'Новый'}
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Состав заказа:</h4>
        <ul className="space-y-1">
          {products.map((product) => (
            <li key={product.id} className="text-sm text-gray-600">
              {product.name} x {product.quantity}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Доставка: {format(new Date(deliveryDate), 'd MMMM yyyy', { locale: ru })}
        </p>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            Изменить
          </Button>
          <Button variant="primary" size="sm">
            Подробнее
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard; 