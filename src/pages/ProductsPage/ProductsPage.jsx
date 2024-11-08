import React, { useState } from 'react';
import { Search, Plus, ChevronDown, ArrowUpDown, Filter, MoreVertical } from 'lucide-react';
import AddProductForm from './components/AddProductForm';
import styles from './ProductsPage.module.css';

const products = [
  { id: 1, name: '25 роз Red Naomi', price: 15000, category: 'Букеты', inventory: 10, status: 'active', image: '/placeholder.svg' },
  { id: 2, name: '51 роза Red Naomi', price: 25000, category: 'Букеты', inventory: 5, status: 'active', image: '/placeholder.svg' },
  { id: 3, name: 'Букет из тюльпанов', price: 8000, category: 'Букеты', inventory: 15, status: 'active', image: '/placeholder.svg' },
  { id: 4, name: 'Корзина с лилиями', price: 12000, category: 'Композиции', inventory: 8, status: 'inactive', image: '/placeholder.svg' },
  { id: 5, name: 'Букет из орхидей', price: 18000, category: 'Букеты', inventory: 3, status: 'active', image: '/placeholder.svg' },
];

function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null); // id товара, для которого открыто меню

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
    setShowActionMenu(null);
  };

  const handleDeleteProduct = (productId) => {
    // Здесь будет логика удаления
    console.log('Удаление товара:', productId);
    setShowActionMenu(null);
  };

  const handleToggleStatus = (product) => {
    // Здесь будет логика изменения статуса
    console.log('Изменение статуса:', product.id);
    setShowActionMenu(null);
  };

  // Компонент меню действий
  const ActionMenu = ({ product }) => (
    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-10">
      <button
        onClick={() => handleEditProduct(product)}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
      >
        Редактировать
      </button>
      <button
        onClick={() => handleToggleStatus(product)}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
      >
        {product.status === 'active' ? 'Скрыть' : 'Показать'}
      </button>
      <button
        onClick={() => handleDeleteProduct(product.id)}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-500"
      >
        Удалить
      </button>
    </div>
  );

  // Обновляем DesktopView
  const DesktopView = () => (
    <div className="hidden sm:block">
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Фильтры и поиск */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск букетов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">Все категории</option>
              <option value="Букеты">Букеты</option>
              <option value="Композиции">Композиции</option>
            </select>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>

            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={20} className="mr-2" />
              Добавить букет
            </button>
          </div>
        </div>

        {/* Таблица */}
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pb-3 text-left">Фото</th>
              <th className="pb-3 text-left">Название</th>
              <th className="pb-3 text-left">Категория</th>
              <th className="pb-3 text-right">Остаток</th>
              <th className="pb-3 text-right">Цена</th>
              <th className="pb-3 text-left">Статус</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-b last:border-b-0">
                <td className="py-4">
                  <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                </td>
                <td className="py-4">{product.name}</td>
                <td className="py-4">{product.category}</td>
                <td className="py-4 text-right">{product.inventory}</td>
                <td className="py-4 text-right">{product.price.toLocaleString()} ₸</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status === 'active' ? 'Активный' : 'Неактивный'}
                  </span>
                </td>
                <td className="py-4 text-right relative">
                  <button 
                    onClick={() => setShowActionMenu(showActionMenu === product.id ? null : product.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical size={20} className="text-gray-400" />
                  </button>
                  {showActionMenu === product.id && <ActionMenu product={product} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Обновляем MobileView
  const MobileView = () => (
    <div className="sm:hidden">
      {/* Заголовок и поиск */}
      <div className="bg-white p-4 border-b sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Мои букеты</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Filter size={20} />
            </button>
            <button 
              className="bg-blue-500 text-white p-2 rounded-lg"
              onClick={() => setShowAddForm(true)}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Поиск букетов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        {/* Фильтры */}
        {showFilters && (
          <div className="mt-4 space-y-3">
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="all">Все категории</option>
              <option value="Букеты">Букеты</option>
              <option value="Композиции">Композиции</option>
            </select>

            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="all">Все статусы</option>
              <option value="active">Активные</option>
              <option value="inactive">Неактивные</option>
            </select>
          </div>
        )}
      </div>

      {/* Список букетов */}
      <div className="p-4">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow mb-4">
            <div className="p-4 flex items-center space-x-4">
              <img src={product.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{product.name}</h3>
                  <button 
                    onClick={() => setShowActionMenu(showActionMenu === product.id ? null : product.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical size={20} className="text-gray-400" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">{product.category}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-medium">{product.price.toLocaleString()} ₸</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status === 'active' ? 'Активный' : 'Неактивный'}
                  </span>
                </div>
              </div>
            </div>
            {showActionMenu === product.id && (
              <div className="border-t px-4 py-2">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="w-full py-2 text-left hover:bg-gray-50 text-sm"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleToggleStatus(product)}
                  className="w-full py-2 text-left hover:bg-gray-50 text-sm"
                >
                  {product.status === 'active' ? 'Скрыть' : 'Показать'}
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="w-full py-2 text-left hover:bg-gray-50 text-sm text-red-500"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <DesktopView />
      <MobileView />
      {showAddForm && (
        <div className="fixed inset-0 z-50">
          <AddProductForm 
            onClose={() => {
              setShowAddForm(false);
              setEditingProduct(null);
            }}
            editingProduct={editingProduct}
          />
        </div>
      )}
    </div>
  );
}

export default ProductsPage;