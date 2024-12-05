import React, { useState } from 'react';
import DataTable from '@/components/ui/DataTable/DataTable';
import { Badge } from '@/components/ui/badge';
import { H3, Body } from '@/components/ui/Typography';

// Демо-данные для таблицы
const initialData = [
  {
    id: 1,
    name: 'Роза красная',
    type: 'flower',
    quantity: 100,
    unit: 'stem',
    price: '500 ₸/stem',
    status: 'in_stock',
    location: ''
  },
  {
    id: 2,
    name: 'Роза розовая',
    type: 'flower',
    quantity: 100,
    unit: 'stem',
    price: '500 ₸/stem',
    status: 'in_stock',
    location: ''
  },
  {
    id: 3,
    name: 'Пион белый',
    type: 'flower',
    quantity: 60,
    unit: 'stem',
    price: '800 ₸/stem',
    status: 'in_stock',
    location: ''
  },
  {
    id: 4,
    name: 'Тюльпан микс',
    type: 'flower',
    quantity: 200,
    unit: 'stem',
    price: '300 ₸/stem',
    status: 'in_stock',
    location: ''
  }
];

// Общие колонки для обоих примеров
const getColumns = () => [
  { 
    key: 'name', 
    label: 'Наименование',
  },
  { 
    key: 'type', 
    label: 'Тип',
  },
  { 
    key: 'quantity', 
    label: 'Количество',
    align: 'center',
    render: (value, item) => `${value} ${item.unit}`
  },
  { 
    key: 'price', 
    label: 'Цена',
    align: 'center'
  },
  { 
    key: 'status', 
    label: 'Статус',
    align: 'center',
    render: (value) => (
      <Badge
        variant={value === 'in_stock' ? 'success' : 'error'}
        className="whitespace-nowrap"
      >
        {value === 'in_stock' ? 'В наличии' : 'Нет в наличии'}
      </Badge>
    )
  }
];

// Пример 1: Таблица с адаптивным видом
export const SimpleDataTable = () => {
  const [data, setData] = useState(initialData);

  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleDelete = (item) => {
    console.log('Delete item:', item);
  };

  const handleQuantityChange = (item, newQuantity) => {
    setData(data.map(i => 
      i.id === item.id 
        ? { ...i, quantity: newQuantity } 
        : i
    ));
  };

  return (
    <DataTable 
      data={data} 
      columns={getColumns()}
      searchPlaceholder="Поиск по названию..."
      onEdit={handleEdit}
      onDelete={handleDelete}
      onQuantityChange={handleQuantityChange}
    />
  );
};

// Пример 2: Таблица с кастомным мобильным видом
export const CustomDataTable = () => {
  const [data, setData] = useState(initialData);

  const handleEdit = (item) => {
    console.log('Edit item:', item);
  };

  const handleDelete = (item) => {
    console.log('Delete item:', item);
  };

  const handleQuantityChange = (item, newQuantity) => {
    setData(data.map(i => 
      i.id === item.id 
        ? { ...i, quantity: newQuantity } 
        : i
    ));
  };

  const renderMobileItem = (item) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <H3 className="font-medium">{item.name}</H3>
          <Body size="sm" className="text-gray-500">
            {item.type} • {item.price}
          </Body>
        </div>
        <Badge
          variant={item.status === 'in_stock' ? 'success' : 'error'}
          className="whitespace-nowrap"
        >
          {item.status === 'in_stock' ? 'В наличии' : 'Нет в наличии'}
        </Badge>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mt-4">
        <Body size="sm" className="text-gray-600 block mb-2">
          Количество: {item.quantity} {item.unit}
        </Body>
      </div>
    </div>
  );

  return (
    <DataTable
      data={data}
      columns={getColumns()}
      renderMobileItem={renderMobileItem}
      searchPlaceholder="Поиск по названию..."
      onEdit={handleEdit}
      onDelete={handleDelete}
      onQuantityChange={handleQuantityChange}
    />
  );
};
