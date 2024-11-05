import React, { useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState(true); // true = ascending

  const { data: products, loading, error } = useSupabase('products', {
    select: `
      *,
      inventory (*)
    `,
    orderBy: {
      column: sortBy,
      ascending: sortOrder
    }
  });

  const categories = ['all', 'Монобукеты', 'Премиум', 'Сезонные', 'Авторские'];
  
  const filteredProducts = products?.filter(product => 
    selectedCategory === 'all' ? true : product.category === selectedCategory
  );

  if (loading) return <div className="p-4">Загрузка данных...</div>;
  if (error) return <div className="p-4 text-red-500">Ошибка: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Букеты</h1>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Добавить букет
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <select 
          className="border p-2 rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'Все категории' : category}
            </option>
          ))}
        </select>

        <select 
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">По названию</option>
          <option value="price">По цене</option>
          <option value="category">По категории</option>
        </select>

        <button 
          className="border p-2 rounded"
          onClick={() => setSortOrder(!sortOrder)}
        >
          {sortOrder ? '↑' : '↓'}
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts?.map(product => (
          <div key={product.id} className="border p-4 rounded shadow bg-white">
            <h4 className="font-bold">{product.name}</h4>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-600">Цена: {product.price.toLocaleString()} ₸</p>
            <p className="text-gray-500">Категория: {product.category}</p>
            <p>SKU: {product.sku}</p>
            {product.inventory && (
              <div className="mt-2 pt-2 border-t">
                <p>Количество: {product.inventory[0]?.quantity || 0}</p>
                <p>Локация: {product.inventory[0]?.location}</p>
                <p className={`${
                  product.inventory[0]?.status === 'in_stock' 
                    ? 'text-green-600' 
                    : product.inventory[0]?.status === 'low_stock'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}>
                  Статус: {
                    product.inventory[0]?.status === 'in_stock' ? 'В наличии' :
                    product.inventory[0]?.status === 'low_stock' ? 'Заканчивается' :
                    'Нет в наличии'
                  }
                </p>
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <button className="bg-blue-100 text-blue-600 px-3 py-1 rounded">
                Редактировать
              </button>
              <button className="bg-red-100 text-red-600 px-3 py-1 rounded">
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage; 