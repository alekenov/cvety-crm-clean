import React, { useState } from 'react';
import { Search, Edit2, Plus, Eye, EyeOff } from 'lucide-react';

const ProductsPage = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const products = [
    { 
      id: 1, 
      name: "Букет 'Нежность'",
      price: 15000,
      image: "/api/placeholder/200/200",
      active: true,
      type: 'букет'
    },
    { 
      id: 2, 
      name: "Букет 'Весеннее настроение'",
      price: 12000,
      image: "/api/placeholder/200/200",
      active: true,
      type: 'букет'
    },
    { 
      id: 3, 
      name: "Композиция 'Летняя'",
      price: 20000,
      image: "/api/placeholder/200/200",
      active: false,
      type: 'композиция'
    }
  ];

  const [activeProducts, setActiveProducts] = useState(products);

  const toggleProductStatus = (id) => {
    setActiveProducts(activeProducts.map(product => 
      product.id === id ? {...product, active: !product.active} : product
    ));
  };

  const ProductCard = ({ product }) => (
    <div className={`bg-white rounded-lg shadow p-4 mb-4 ${!product.active && 'opacity-60'}`}>
      <div className="flex space-x-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-24 h-24 object-cover rounded-lg"
        />
        
        <div className="flex-grow">
          <div className="mb-1">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.type}</p>
          </div>
          
          <p className="text-lg font-bold text-green-600">
            {product.price.toLocaleString()} ₸
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={() => toggleProductStatus(product.id)}
            className={`p-2 rounded-full ${product.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
          >
            {product.active ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <button
            className="p-2 rounded-full bg-blue-100 text-blue-600"
            onClick={() => alert(`Редактирование ${product.name}`)}
          >
            <Edit2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const ProductTable = () => (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Фото
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Тип
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Цена
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredProducts.map((product) => (
            <tr key={product.id} className={!product.active ? 'opacity-60' : ''}>
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 object-cover rounded-lg"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.type}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-green-600">
                {product.price.toLocaleString()} ₸
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => toggleProductStatus(product.id)}
                  className={`p-2 rounded-full ${
                    product.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {product.active ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  className="p-2 rounded-full bg-blue-100 text-blue-600"
                  onClick={() => alert(`Редактирование ${product.name}`)}
                >
                  <Edit2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const filteredProducts = activeProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Верхняя панель */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Мои товары</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 bg-white rounded-lg"
            >
              <Search size={20} className="text-gray-600" />
            </button>
            <button 
              className="p-2 bg-green-500 text-white rounded-lg flex items-center"
              onClick={() => alert('Добавление нового товара')}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Поиск */}
        {showSearch && (
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск по названию"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border"
              />
            </div>
          </div>
        )}

        {/* Условный рендеринг в зависимости от размера экрана */}
        <div className="hidden sm:block">
          <ProductTable />
        </div>
        <div className="sm:hidden max-w-md mx-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Товары не найдены
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 