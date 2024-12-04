import React from 'react';
import DataTable from './DataTable';
import { Badge } from '@/components/ui/badge';

// Пример 1: Простая таблица с колонками
export const SimpleTable = () => {
  const data = [
    { id: 1, name: 'Товар 1', price: 1000, status: 'active' },
    { id: 2, name: 'Товар 2', price: 2000, status: 'inactive' },
  ];

  const columns = [
    { key: 'name', label: 'Название' },
    { key: 'price', label: 'Цена', render: (value) => `${value} ₸` },
    { 
      key: 'status', 
      label: 'Статус',
      render: (value) => (
        <Badge variant={value === 'active' ? 'success' : 'error'}>
          {value === 'active' ? 'Активен' : 'Неактивен'}
        </Badge>
      )
    },
  ];

  return <DataTable data={data} columns={columns} />;
};

// Пример 2: Таблица с кастомным рендерингом элементов
export const CustomTable = () => {
  const data = [
    {
      id: 1,
      name: 'Розы красные',
      quantity: 100,
      price: 1000,
      status: 'in_stock'
    },
    {
      id: 2,
      name: 'Тюльпаны',
      quantity: 5,
      price: 500,
      status: 'low_stock'
    }
  ];

  const renderItem = (item) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <H3 className="font-medium">{item.name}</H3>
          <Body size="sm" className="text-gray-500">
            {item.price.toLocaleString()} ₸
          </Body>
        </div>
        <Caption
          className={`inline-block px-2 py-1 rounded-full ${
            item.status === 'in_stock'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {item.status === 'in_stock' ? 'В наличии' : 'Заканчивается'}
        </Caption>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <Body size="sm" className="text-gray-600 block mb-2">
          Количество: {item.quantity}
        </Body>
      </div>
    </div>
  );

  return (
    <DataTable
      data={data}
      renderItem={renderItem}
      searchPlaceholder="Поиск по названию..."
    />
  );
};
