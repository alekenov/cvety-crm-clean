import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, ArrowLeft, Upload, Truck, Percent, Calendar, Flower, Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import FlowerSelector from './FlowerSelector';
import BouquetCompositionEditor from '@/components/products/BouquetCompositionEditor';
import MediaUpload from '@/components/MediaUpload';

const ProductForm = ({ onClose, editingProduct = null, viewMode = false, onProductUpdate }) => {
  console.log('AddProductForm rendered with editingProduct:', editingProduct);

  // Функция для генерации SKU
  const generateSKU = (name) => {
    const prefix = name.trim().slice(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}-${timestamp}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    category: 'bouquets',
    status: 'active',
    activeTab: 'composition'
  });

  const [composition, setComposition] = useState([]);
  const [showFlowerSelector, setShowFlowerSelector] = useState(false);
  const [basePrice, setBasePrice] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [mediaFiles, setMediaFiles] = useState([]);

  // Загрузка данных при редактировании
  useEffect(() => {
    console.log('useEffect triggered with editingProduct:', editingProduct);
    
    const loadProductComposition = async (productId) => {
      const { data: compositionData, error } = await supabase
        .from('product_compositions')
        .select(`
          *,
          inventory:inventory_item_id (
            id,
            name,
            price,
            unit
          )
        `)
        .eq('product_id', productId);

      if (error) {
        console.error('Error loading composition:', error);
        return;
      }

      const formattedComposition = compositionData.map(item => ({
        inventory_item_id: item.inventory_item_id,
        name: item.inventory.name,
        price: item.inventory.price,
        unit: item.inventory.unit,
        quantity: item.quantity
      }));

      setComposition(formattedComposition);
    };
    
    if (editingProduct) {
      console.log('Setting form data from editingProduct:', {
        name: editingProduct.name,
        category: editingProduct.category,
        status: editingProduct.status
      });
      
      // Устанавливаем основные данные
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || 'bouquets',
        status: editingProduct.status || 'active',
        activeTab: 'composition'
      });

      // Загружаем состав букета
      loadProductComposition(editingProduct.id);
    }
  }, [editingProduct]);

  // Обработчик изменения основных полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Обработчик добавления цветка
  const handleFlowerSelect = (flower) => {
    setComposition(prev => {
      const existingFlower = prev.find(item => item.inventory_item_id === flower.id);
      if (existingFlower) {
        return prev.map(item =>
          item.inventory_item_id === flower.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        inventory_item_id: flower.id,
        name: flower.name,
        price: flower.price,
        unit: flower.unit,
        quantity: 1
      }];
    });
    setShowFlowerSelector(false);
  };

  // Обработчик изменения количества цветка
  const handleQuantityChange = (flowerId, change) => {
    setComposition(prev =>
      prev.map(item => {
        if (item.inventory_item_id === flowerId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Валидация формы
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Введите название букета');
      return false;
    }
    if (composition.length === 0) {
      toast.error('Добавьте хотя бы один цветок в состав');
      return false;
    }
    return true;
  };

  // Пересчет цен при изменении состава
  useEffect(() => {
    const base = composition.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
    setBasePrice(base);
    setFinalPrice(base);
  }, [composition]);

  // Сохранение продукта
  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error('Пожалуйста, введите название букета');
        return;
      }

      const totalPrice = composition.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0);

      if (editingProduct) {
        // Обновляем существующий продукт
        const { data, error } = await supabase
          .from('products')
          .update({
            name: formData.name.trim(),
            category: formData.category,
            status: formData.status,
            price: totalPrice,
            base_price: totalPrice,
            markup_amount: 0,
            packaging_cost: 0
          })
          .eq('id', editingProduct.id)
          .select()
          .single();

        if (error) throw error;
        const productId = editingProduct.id;

        // Удаляем старый состав
        const { error: deleteError } = await supabase
          .from('product_compositions')
          .delete()
          .eq('product_id', productId);

        if (deleteError) throw deleteError;

        // Добавляем новый состав
        if (composition.length > 0) {
          const compositionData = composition.map(item => ({
            product_id: productId,
            inventory_item_id: item.inventory_item_id,
            quantity: item.quantity,
            cost: item.price
          }));

          const { error: compositionError } = await supabase
            .from('product_compositions')
            .insert(compositionData);

          if (compositionError) throw compositionError;
        }

        // Обработка медиафайлов
        const mediaUploadPromises = mediaFiles.map(async (media, index) => {
          const fileExt = media.file.name.split('.').pop();
          const fileName = `${productId}_${Date.now()}_${index}.${fileExt}`;
          const filePath = `product_media/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product_media')
            .upload(filePath, media.file);

          if (uploadError) throw uploadError;

          return {
            product_id: productId,
            file_path: filePath,
            type: media.type,
            order: index
          };
        });

        const mediaData = await Promise.all(mediaUploadPromises);

        const { error: mediaError } = await supabase
          .from('product_media')
          .insert(mediaData);

        if (mediaError) throw mediaError;

        toast.success('Букет обновлен');
        onClose();
        onProductUpdate();
      } else {
        // Создаем новый продукт
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: formData.name.trim(),
            category: formData.category,
            status: formData.status,
            sku: generateSKU(formData.name),
            price: totalPrice,
            base_price: totalPrice,
            markup_amount: 0,
            packaging_cost: 0
          })
          .select()
          .single();

        if (error) throw error;
        const productId = data.id;

        // Добавляем состав
        if (composition.length > 0) {
          const compositionData = composition.map(item => ({
            product_id: productId,
            inventory_item_id: item.inventory_item_id,
            quantity: item.quantity,
            cost: item.price
          }));

          const { error: compositionError } = await supabase
            .from('product_compositions')
            .insert(compositionData);

          if (compositionError) throw compositionError;
        }

        // Обработка медиафайлов
        const mediaUploadPromises = mediaFiles.map(async (media, index) => {
          const fileExt = media.file.name.split('.').pop();
          const fileName = `${productId}_${Date.now()}_${index}.${fileExt}`;
          const filePath = `product_media/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product_media')
            .upload(filePath, media.file);

          if (uploadError) throw uploadError;

          return {
            product_id: productId,
            file_path: filePath,
            type: media.type,
            order: index
          };
        });

        const mediaData = await Promise.all(mediaUploadPromises);

        const { error: mediaError } = await supabase
          .from('product_media')
          .insert(mediaData);

        if (mediaError) throw mediaError;

        toast.success('Букет создан');
        onClose();
        onProductUpdate();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Ошибка при сохранении букета');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Хедер с вкладками */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between px-4 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold">
                {editingProduct ? 'Редактировать букет' : 'Новый букет'}
              </h2>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Сохранить
              </button>
            </div>
          </div>

          {/* Вкладки */}
          <div className="flex space-x-1 px-4">
            <button
              onClick={() => setFormData(prev => ({ ...prev, activeTab: 'composition' }))}
              className={`px-4 py-2 rounded-t-lg ${
                formData.activeTab === 'composition'
                  ? 'bg-white border-t border-l border-r text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Состав
            </button>
            <button
              onClick={() => setFormData(prev => ({ ...prev, activeTab: 'marketing' }))}
              className={`px-4 py-2 rounded-t-lg ${
                formData.activeTab === 'marketing'
                  ? 'bg-white border-t border-l border-r text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Маркетинг
            </button>
          </div>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {formData.activeTab === 'composition' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Левая колонка - основная информация */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название букета
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите название букета"
                    required
                  />
                </div>
                <MediaUpload onMediaChange={setMediaFiles} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Категория
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 pl-3 pr-10 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="bouquets">🌸 Букеты</option>
                      <option value="arrangements">🎍 Композиции</option>
                      <option value="wedding">💐 Свадебные</option>
                      <option value="business">🏢 Бизнес</option>
                      <option value="gifts">🎁 Подарки</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Статус
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 pl-3 pr-10 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">🟢 Активный</option>
                      <option value="draft">⚪️ Черновик</option>
                      <option value="archived">⚫️ Архивный</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка - состав и цены */}
            <div className="space-y-6">
              {/* Состав букета */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Состав букета</h3>
                  <button
                    onClick={() => setShowFlowerSelector(true)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Добавить цветок
                  </button>
                </div>

                <BouquetCompositionEditor
                  initialComposition={composition}
                  onCompositionChange={setComposition}
                  maxItems={20}
                />

                {/* Итоговая цена */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between font-bold">
                    <span>Итоговая цена:</span>
                    <span>{finalPrice.toLocaleString()} ₸</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Вкладка маркетинга */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-800">
                Раздел в разработке. Здесь будут настройки для маркетинга и продвижения.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно выбора цветов */}
      {showFlowerSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Выбор цветов</h3>
              <button
                onClick={() => setShowFlowerSelector(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <FlowerSelector onSelect={handleFlowerSelect} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;