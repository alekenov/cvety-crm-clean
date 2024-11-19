import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown, ArrowUpDown, Filter, MoreVertical } from 'lucide-react';
import AddProductForm from './components/AddProductForm';
import { supabase } from '../../lib/supabase';
import styles from './ProductsPage.module.css';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // Загрузка продуктов
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_compositions (
            id,
            quantity,
            price_per_stem,
            inventory:inventory_item_id (
              id,
              products (
                id,
                name,
                price
              )
            )
          )
        `)
        .order('created_at', { ascending: false });  

      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      if (!productsData) {
        console.log('No products data received');
        setProducts([]);
        return;
      }

      console.log('Received products:', productsData);

      const productsWithDetails = productsData.map(product => {
        const composition = product.product_compositions?.map(item => ({
          id: item.id,
          name: item.inventory?.products?.name || 'Неизвестный цветок',
          quantity: parseInt(item.quantity) || 0,
          price_per_stem: parseFloat(item.price_per_stem) || 0,
          inventory_item_id: item.inventory?.id
        })) || [];

        const basePrice = parseFloat(product.base_price) || 0;
        const markupAmount = parseFloat(product.markup_amount) || 0;
        const packagingCost = parseFloat(product.packaging_cost) || 2000;
        const finalPrice = parseFloat(product.price) || 0;

        return {
          ...product,
          total_stems: composition.reduce((sum, item) => sum + item.quantity, 0),
          composition_details: composition,
          price_details: {
            basePrice,
            markupAmount,
            packagingCost,
            finalPrice
          }
        };
      });

      console.log('Processed products:', productsWithDetails);
      setProducts(productsWithDetails);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]); 
    } finally {
      setLoading(false);
    }
  };

  // Обработчики действий
  const handleEditProduct = async (product) => {
    setEditingProduct(product);
    setShowAddForm(true);
    setShowActionMenu(null);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);

        if (error) throw error;
        await loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
    setShowActionMenu(null);
  };

  const handleToggleStatus = async (product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', product.id);

      if (error) throw error;
      await loadProducts();
    } catch (error) {
      console.error('Error updating product status:', error);
    }
    setShowActionMenu(null);
  };

  // Обработчик для просмотра букета
  const handleViewProduct = (product) => {
    console.log('Viewing product:', product);
    setSelectedProduct(product);
    setIsViewMode(true);
    setShowAddForm(true);
    setShowActionMenu(null);
  };

  // Фильтрация продуктов
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Компонент меню действий
  const ActionMenu = ({ product }) => (
    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border py-1 z-10">
      <button
        onClick={() => handleViewProduct(product)}
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
      >
        Просмотреть
      </button>
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
  const DesktopView = ({ products }) => (
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
              <th className="pb-3 text-left">Названи</th>
              <th className="pb-3 text-left">Категория</th>
              <th className="pb-3 text-right">Остаток</th>
              <th className="pb-3 text-right">Цена</th>
              <th className="pb-3 text-left">Статус</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Обновляем MobileView
  const MobileView = ({ products }) => (
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

  // Обновляем рендер карточки продукта в DesktopView
  const ProductCard = ({ product }) => {
    console.log('Rendering product:', product); 

    const priceDetails = product.price_details || {
      basePrice: parseFloat(product.price) || 0,
      markupAmount: 0,
      packagingCost: 0,
      finalPrice: parseFloat(product.price) || 0
    };

    return (
      <tr 
        key={product.id} 
        className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
        onClick={() => handleViewProduct(product)}
      >
        <td className="py-4">
          <img src={product.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
        </td>
        <td className="py-4">
          <div>{product.name}</div>
          <div className="text-sm text-gray-500">
            {product.total_stems || 0} цветов
          </div>
        </td>
        <td className="py-4">{product.category}</td>
        <td className="py-4 text-right">
          {product.composition_details?.map(item => (
            <div key={item.id} className="text-sm">
              {item.name}: {item.quantity} шт
            </div>
          ))}
        </td>
        <td className="py-4 text-right">
          <div className="font-medium">{priceDetails.finalPrice.toLocaleString()} ₸</div>
          {product.category === 'Цветы' ? (
            <div className="text-sm text-gray-500">
              Цена за штуку
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-500">
                Цветы: {priceDetails.basePrice.toLocaleString()} ₸
              </div>
              <div className="text-sm text-gray-500">
                Работа: {priceDetails.markupAmount.toLocaleString()} ₸
              </div>
              <div className="text-sm text-gray-500">
                Упаковка: {priceDetails.packagingCost.toLocaleString()} ₸
              </div>
            </>
          )}
        </td>
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
            onClick={(e) => {
              e.stopPropagation();
              setShowActionMenu(showActionMenu === product.id ? null : product.id);
            }}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <MoreVertical size={20} className="text-gray-400" />
          </button>
          {showActionMenu === product.id && <ActionMenu product={product} />}
        </td>
      </tr>
    );
  };

  // Обновляем опции фильтра категорий
  const categoryOptions = [
    { value: 'all', label: 'Все категории' },
    { value: 'Букеты', label: 'Букеты' },
    { value: 'Композиции', label: 'Композиции' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <DesktopView products={filteredProducts} />
      <MobileView products={filteredProducts} />
      {showAddForm && (
        <AddProductForm 
          onClose={() => {
            setShowAddForm(false);
            setSelectedProduct(null);
            setEditingProduct(null);
            setIsViewMode(false);
            loadProducts();
          }}
          editingProduct={editingProduct}
          viewMode={isViewMode && !editingProduct}
          selectedProduct={selectedProduct}
          supabase={supabase}
          categoryOptions={categoryOptions}
        />
      )}
    </div>
  );
}

export default ProductsPage;