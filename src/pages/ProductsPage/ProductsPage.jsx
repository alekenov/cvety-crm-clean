import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronDown, ArrowUpDown, Filter, MoreVertical } from 'lucide-react';
import AddProductForm from './components/AddProductForm';
import CreateSampleProducts from './components/CreateSampleProducts';
import { supabase } from '../../lib/supabase';
import { Button } from '@/components/ui/button';
import styles from '@/styles/pages.module.css';
import toast from 'react-hot-toast';

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
            inventory_item:inventory_item_id (
              id,
              name,
              price
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
          name: item.inventory_item?.name || 'Неизвестный цветок',
          quantity: parseInt(item.quantity) || 0,
          price_per_stem: parseFloat(item.inventory_item?.price) || 0,
          inventory_item_id: item.inventory_item?.id
        })) || [];

        // Вычисляем базовую стоимость как сумму стоимости всех цветов
        const basePrice = composition.reduce((sum, item) => 
          sum + (item.price_per_stem * item.quantity), 0);
        
        const finalPrice = basePrice * 1.3 + 2000; // 30% наценка + упаковка 2000 тг

        return {
          ...product,
          total_stems: composition.reduce((sum, item) => sum + item.quantity, 0),
          composition_details: composition,
          price_details: {
            basePrice,
            markupAmount: basePrice * 0.3,
            packagingCost: 2000,
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
    console.log('Editing product:', product);
    try {
      // Загружаем полные данные о продукте
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          product_compositions (
            id,
            quantity,
            inventory_item:inventory_item_id (
              id,
              name,
              price,
              unit
            )
          )
        `)
        .eq('id', product.id)
        .single();

      if (productError) throw productError;

      console.log('Loaded product data:', productData);

      // Форматируем состав для формы
      const formattedProduct = {
        ...productData,
        composition_details: productData.product_compositions.map(item => ({
          id: item.id,
          inventory_item_id: item.inventory_item.id,
          name: item.inventory_item.name,
          price: item.inventory_item.price,
          unit: item.inventory_item.unit,
          quantity: item.quantity
        }))
      };

      console.log('Formatted product:', formattedProduct);
      setEditingProduct(formattedProduct);
      setShowAddForm(true);
      setShowActionMenu(null);
    } catch (error) {
      console.error('Error loading product details:', error);
      toast.error('Ошибка при загрузке данных букета');
    }
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
  const handleViewProduct = async (product) => {
    console.log('Viewing product:', product);
    try {
      // Загружаем полные данные о продукте
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          product_compositions (
            id,
            quantity,
            inventory_item:inventory_item_id (
              id,
              name,
              price,
              unit
            )
          )
        `)
        .eq('id', product.id)
        .single();

      if (productError) throw productError;

      console.log('Loaded product data:', productData);

      // Форматируем данные для формы
      const formattedProduct = {
        ...productData,
        composition_details: productData.product_compositions.map(item => ({
          id: item.id,
          inventory_item_id: item.inventory_item.id,
          name: item.inventory_item.name,
          price: item.inventory_item.price,
          unit: item.inventory_item.unit,
          quantity: item.quantity
        }))
      };

      console.log('Formatted product:', formattedProduct);
      setSelectedProduct(formattedProduct);
      setEditingProduct(formattedProduct);
      setShowAddForm(true);
    } catch (error) {
      console.error('Error loading product details:', error);
      toast.error('Ошибка при загрузке данных букета');
    }
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
      <Button
        onClick={() => handleViewProduct(product)}
        variant="ghost"
        size="md"
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
      >
        Просмотреть
      </Button>
      <Button
        onClick={() => handleEditProduct(product)}
        variant="ghost"
        size="md"
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
      >
        Редактировать
      </Button>
      <Button
        onClick={() => handleToggleStatus(product)}
        variant="ghost"
        size="md"
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
      >
        {product.status === 'active' ? 'Скрыть' : 'Показать'}
      </Button>
      <Button
        onClick={() => handleDeleteProduct(product.id)}
        variant="ghost"
        size="md"
        className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm text-red-500"
      >
        Удалить
      </Button>
    </div>
  );

  // Обновляем DesktopView
  const DesktopView = ({ products }) => (
    <div className="hidden sm:block">
      <div className={styles.pageSection}>
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

            <Button 
              onClick={() => setShowAddForm(true)}
              variant="primary"
              size="md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить букет
            </Button>
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
      <div className={styles.pageHeader}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Мои букеты</h1>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant="ghost"
              size="icon"
            >
              <Filter className="w-5 h-5" />
            </Button>
            <Button 
              onClick={() => setShowAddForm(true)}
              variant="primary"
              size="icon"
            >
              <Plus className="w-5 h-5" />
            </Button>
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
      <div className={styles.pageSection}>
        {products.map(product => (
          <div key={product.id} className={styles.productCard}>
            <img src={product.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{product.name}</h3>
                <Button 
                  onClick={() => setShowActionMenu(showActionMenu === product.id ? null : product.id)}
                  variant="ghost"
                  size="icon"
                >
                  <MoreVertical size={20} className="text-gray-400" />
                </Button>
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
            {showActionMenu === product.id && (
              <div className="border-t px-4 py-2">
                <Button
                  onClick={() => handleEditProduct(product)}
                  variant="ghost"
                  size="md"
                  className="w-full py-2 text-left hover:bg-gray-50 text-sm"
                >
                  Редактировать
                </Button>
                <Button
                  onClick={() => handleToggleStatus(product)}
                  variant="ghost"
                  size="md"
                  className="w-full py-2 text-left hover:bg-gray-50 text-sm"
                >
                  {product.status === 'active' ? 'Скрыть' : 'Показать'}
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(product.id)}
                  variant="ghost"
                  size="md"
                  className="w-full py-2 text-left hover:bg-gray-50 text-sm text-red-500"
                >
                  Удалить
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Обновляем рендер карточки продукта в DesktopView
  const ProductCard = ({ product }) => {
    return (
      <tr 
        key={product.id} 
        className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
        onClick={() => handleViewProduct(product)}
      >
        <td className="py-4">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-flower.svg';
              }}
            />
          ) : (
            <img 
              src="/placeholder-flower.svg"
              alt="Placeholder"
              className="w-12 h-12 rounded-lg"
            />
          )}
        </td>
        <td className="py-4">
          <div>{product.name}</div>
          <div className="text-sm text-gray-500">
            {product.composition_details?.length || 0} позиций
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
          <div className="font-medium">{parseFloat(product.price).toLocaleString()} ₸</div>
          <div className="text-sm text-gray-500">
            {product.composition_details?.map(item => (
              <div key={item.id}>
                {item.name}: {(item.price_per_stem * item.quantity).toLocaleString()} ₸
              </div>
            ))}
          </div>
        </td>
        <td className="py-4">
          <span className={`px-2 py-1 rounded-full text-xs ${
            product.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {product.status === 'active' ? 'Активен' : 'Неактивен'}
          </span>
        </td>
        <td className="py-4 text-right">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActionMenu(showActionMenu === product.id ? null : product.id);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreVertical size={20} />
            </button>
            {showActionMenu === product.id && (
              <ActionMenu product={product} />
            )}
          </div>
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
    <div className={styles.pageContainer}>
      <CreateSampleProducts />
      <DesktopView products={filteredProducts} />
      <MobileView products={filteredProducts} />
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <AddProductForm
              onClose={() => {
                setShowAddForm(false);
                setEditingProduct(null);
              }}
              editingProduct={editingProduct}
              onProductUpdate={loadProducts}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;