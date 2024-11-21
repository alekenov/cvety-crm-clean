import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, ArrowLeft, Upload, Truck, Percent, Calendar, Flower, Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

// Обновляем компонент кнопок
const SaveCloseButtons = ({ onSave, onClose, isSaving = false, viewMode = false }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
      <div className="max-w-6xl mx-auto flex justify-end space-x-4">
        {/* Показываем кнопку "Сохранить" всегда */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 border rounded-lg hover:bg-gray-50"
        >
          {viewMode ? 'Закрыть' : 'Отмена'}
        </button>
      </div>
    </div>
  );
};

const ProductCard = ({ onClose, editingProduct = null, viewMode = false, selectedProduct = null, onSave }) => {
  console.log('ProductCard props:', { editingProduct, viewMode, selectedProduct }); // Для отладки
  
  const [activeTab, setActiveTab] = useState('main');
  const [media, setMedia] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [composition, setComposition] = useState([]);

  // Список тегов для категорий
  const tags = [
    'Популярные букеты',
    'Монобукеты',
    'В коробке',
    'В корзине',
    'Свадебные',
    'Премиум'
  ];

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
  });

  // Добавляем состояния для цен
  const [basePrice, setBasePrice] = useState(0);
  const [markupAmount, setMarkupAmount] = useState(0);
  const [packagingCost, setPackagingCost] = useState(0);

  // Функция для генерации SKU
  const generateSKU = (name) => {
    const timestamp = Date.now().toString().slice(-4);
    const namePrefix = name.slice(0, 3).toUpperCase();
    return `${namePrefix}-${timestamp}`;
  };

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updates = {
        ...prev,
        [name]: value
      };
      
      // Автоматически генерируем SKU при изменении названия
      if (name === 'name' && value) {
        updates.sku = generateSKU(value);
      }
      
      return updates;
    });
  };

  // Обработчик загрузки изображений
  const handleMediaUpload = async (e) => {
    const loadingToast = toast.loading('Загрузка изображений...');
    try {
      const files = Array.from(e.target.files).map(file => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file)
      }));
      setMedia([...media, ...files]);
      toast.success('Изображения успешно загружены');
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Ошибка при загрузке изображений');
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleQuantityChange = (flowerId, change) => {
    const updatedComposition = composition.map(flower => {
      if (flower.id === flowerId) {
        const newQuantity = Math.max(1, flower.quantity + change);
        return { ...flower, quantity: newQuantity };
      }
      return flower;
    });
    
    setComposition(updatedComposition);
    
    // Пересчитываем базовую цену после изменения количества
    const newPrices = calculateFinalPrice();
    setBasePrice(newPrices.basePrice);
  };

  const removeFlower = (flowerId) => {
    setComposition(composition.filter(flower => flower.id !== flowerId));
  };

  // Функция расчета итоговой цены
  const calculateFinalPrice = () => {
    try {
      console.log('Calculating final price for composition:', composition);
      
      // Проверяем, что у нас есть цветы в композиции
      if (!composition || composition.length === 0) {
        console.log('Empty composition');
        return {
          basePrice: 0,
          markupAmount: 0,
          finalPrice: 0
        };
      }

      // Базовая стоимость (сумма всех цветов)
      let hasValidPrices = true;
      const basePrice = composition.reduce((sum, flower) => {
        // Check for either pricePerStem or price_per_stem
        const priceValue = flower.pricePerStem || flower.price_per_stem;
        const price = priceValue ? parseFloat(priceValue) : null;
        const quantity = flower.quantity ? parseInt(flower.quantity) : null;
        
        console.log('Processing flower:', {
          name: flower.name,
          priceValue,
          parsedPrice: price,
          quantity
        });

        if (price === null || quantity === null || isNaN(price) || isNaN(quantity)) {
          console.error('Invalid price or quantity for flower:', {
            name: flower.name,
            priceValue,
            parsedPrice: price,
            quantity
          });
          hasValidPrices = false;
          return sum;
        }

        const itemTotal = price * quantity;
        console.log(`Calculated total for ${flower.name}:`, {
          price,
          quantity,
          itemTotal
        });
        
        return sum + itemTotal;
      }, 0);

      if (!hasValidPrices) {
        console.error('Some flowers have invalid prices or quantities');
        return {
          basePrice: 0,
          markupAmount: 0,
          finalPrice: 0
        };
      }

      console.log('Base price calculated:', basePrice);

      // Наценка (30%)
      const markup = 0.3;
      const markupAmount = basePrice * markup;
      console.log('Markup amount:', markupAmount);

      // Итоговая стоимость
      const finalPrice = basePrice + markupAmount;
      console.log('Final price:', finalPrice);

      if (isNaN(finalPrice) || finalPrice <= 0) {
        console.error('Invalid final price calculated:', { basePrice, markupAmount, finalPrice });
        return {
          basePrice: 0,
          markupAmount: 0,
          finalPrice: 0
        };
      }

      return {
        basePrice,
        markupAmount,
        finalPrice
      };
    } catch (error) {
      console.error('Error calculating price:', error);
      return {
        basePrice: 0,
        markupAmount: 0,
        finalPrice: 0
      };
    }
  };

  const totalAmount = composition.reduce((sum, flower) => {
    const price = flower.pricePerStem || flower.price_per_stem;
    const quantity = flower.quantity ? parseInt(flower.quantity) : 0;
    return sum + (price * quantity);
  }, 0);

  // Добавляем новые состояния для маркетинга и группировки
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [groupedBouquets, setGroupedBouquets] = useState([]);
  const [marketing, setMarketing] = useState({
    freeDelivery: {
      enabled: false,
      endDate: ''
    },
    discount: {
      enabled: false,
      amount: '',
      endDate: ''
    }
  });

  // Временные данные для примера
  const availableBouquets = [
    {
      id: 2,
      name: 'Букет "Нежность"',
      price: 15000,
      image: '/api/placeholder/100/100',
      description: '15 белых роз'
    },
    {
      id: 3,
      name: 'Букет "Яркий"',
      price: 18000,
      image: '/api/placeholder/100/100',
      description: 'Микс из разных цветов'
    }
  ];

  const [showFlowerSelector, setShowFlowerSelector] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [searchFlower, setSearchFlower] = useState('');
  const [loadingInventory, setLoadingInventory] = useState(false);

  // Загрузка товаров из инвентаря
  const loadInventoryItems = async () => {
    try {
      setLoadingInventory(true);
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (
            id,
            name,
            price,
            description
          )
        `)
        .eq('status', 'in_stock');

      if (error) throw error;

      // Преобразуем данные в удобный формат
      const formattedData = data.map(item => {
        const price = item.products.price ? parseFloat(item.products.price) : 0;
        console.log(`Formatting inventory item ${item.products.name}:`, { price });
        return {
          id: item.id,
          name: item.products.name,
          price: price,
          quantity: item.quantity,
          product_id: item.products.id
        };
      });

      console.log('Formatted inventory data:', formattedData);
      setInventoryItems(formattedData);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoadingInventory(false);
    }
  };

  // Загружаем инвентарь при открытии формы
  useEffect(() => {
    loadInventoryItems();
  }, []);

  // Добавление цветка в состав букета
  const handleAddFlower = (inventoryItem) => {
    console.log('Adding flower:', inventoryItem);
    
    // Проверяем, что у цветка есть цена
    const price = inventoryItem.price_per_stem;
    if (!price || isNaN(parseFloat(price))) {
      console.error('Invalid price for flower:', inventoryItem);
      alert('У выбранного цветка отсутствует цена');
      return;
    }

    // Проверяем, есть ли уже такой цветок в композиции
    const existingFlowerIndex = composition.findIndex(
      flower => flower.inventory_item_id === inventoryItem.id
    );

    if (existingFlowerIndex !== -1) {
      // Если цветок уже есть, увеличиваем количество
      const updatedComposition = [...composition];
      updatedComposition[existingFlowerIndex] = {
        ...updatedComposition[existingFlowerIndex],
        quantity: (updatedComposition[existingFlowerIndex].quantity || 0) + 1
      };
      console.log('Updated composition:', updatedComposition);
      setComposition(updatedComposition);
    } else {
      // Если цветка нет, добавляем новый
      const newFlower = {
        id: Date.now(),
        inventory_item_id: inventoryItem.id,
        name: inventoryItem.name,
        price_per_stem: inventoryItem.price_per_stem,
        quantity: 1
      };
      console.log('New flower:', newFlower);
      setComposition(prev => [...prev, newFlower]);
    }
  };

  // Модальное окно выбора цветов
  const FlowerSelectorModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Выберите цветы</h3>
          <button 
            onClick={() => setShowFlowerSelector(false)}
            className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              className="w-full p-3 pl-10 border rounded-lg"
              placeholder="Поиск цветов..."
              value={searchFlower}
              onChange={(e) => setSearchFlower(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>
        </div>

        {loadingInventory ? (
          <div className="text-center py-4">Загрузка...</div>
        ) : (
          <div className="space-y-2">
            {inventoryItems
              .filter(item => 
                item.name.toLowerCase().includes(searchFlower.toLowerCase()) &&
                item.quantity > 0
              )
              .map((flower) => (
                <button
                  key={flower.id}
                  onClick={() => handleAddFlower(flower)}
                  className="w-full py-3 px-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{flower.name}</div>
                      <div className="text-sm text-gray-500">
                        {(flower.price ? parseFloat(flower.price) : 0).toLocaleString()} ₸/шт
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      В наличии: {flower.quantity} шт
                    </div>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  // Обновляем функцию сохранения с улучшенной обработкой ошибок
  const handleSave = async () => {
    const loadingToast = toast.loading('Сохранение продукта...');
    try {
      setIsSaving(true);

      // Валидация данных перед сохранением
      if (!formData.name?.trim()) {
        throw new Error('Введите название букета');
      }

      if (selectedTags.length === 0) {
        throw new Error('Выберите хотя бы одну категорию');
      }

      if (composition.length === 0) {
        throw new Error('Добавьте хотя бы один цветок в букет');
      }

      const priceDetails = calculateFinalPrice();
      console.log('Price details before save:', priceDetails);
      
      // Проверяем корректность цен
      if (!priceDetails.finalPrice || priceDetails.finalPrice <= 0) {
        console.error('Invalid price details:', priceDetails);
        throw new Error('Некорректная итоговая стоимость букета. Проверьте цены цветов и их количество.');
      }

      // Базовые данные продукта
      const productData = {
        name: formData.name.trim(),
        category: selectedTags[0],
        price: priceDetails.finalPrice,
        description: '',
        status: 'active',
        image_url: media[0]?.url || null,
        base_price: priceDetails.basePrice,
        markup_amount: priceDetails.markupAmount
      };

      // Определяем ID продукта
      const productId = editingProduct?.id || selectedProduct?.id;

      let savedProductId;

      if (productId) {
        // Обновление существующего продукта
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId)
          .select()
          .single();

        if (error) {
          console.error('Error updating product:', error);
          throw new Error(error.message);
        }

        savedProductId = productId;

        // Удаляем старый состав
        const { error: deleteError } = await supabase
          .from('product_compositions')
          .delete()
          .eq('product_id', productId);

        if (deleteError) {
          console.error('Error deleting old composition:', deleteError);
          throw new Error('Ошибка при обновлении состава букета');
        }
      } else {
        // Создание нового продукта
        const { data, error } = await supabase
          .from('products')
          .insert([{
            ...productData,
            sku: `BQT-${Date.now()}`
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating product:', error);
          throw new Error(error.message);
        }

        savedProductId = data.id;
      }

      // Сохраняем состав букета
      if (composition.length > 0) {
        const compositionData = composition.map(flower => ({
          product_id: savedProductId,
          inventory_item_id: flower.inventory_item_id,
          quantity: flower.quantity,
          price_per_stem: flower.price_per_stem
        }));

        const { error: compositionError } = await supabase
          .from('product_compositions')
          .insert(compositionData);

        if (compositionError) {
          console.error('Error saving composition:', compositionError);
          throw new Error('Ошибка при сохранении состава букета');
        }
      }

      toast.success('Продукт успешно сохранен');
      toast.dismiss(loadingToast);
      onSave && onSave();
    } catch (error) {
      console.error('Error saving bouquet:', error);
      toast.error('Ошибка при сохранении: ' + error.message);
      toast.dismiss(loadingToast);
    } finally {
      setIsSaving(false);
    }
  };

  // Обновляем компонент PriceBreakdown
  const PriceBreakdown = () => {
    const priceDetails = calculateFinalPrice();
    const flowerCount = composition.reduce((sum, flower) => sum + (flower.quantity || 0), 0);
    
    return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Стоимость цветов:</span>
            <span>{(priceDetails.basePrice || 0).toLocaleString()} ₸</span>
          </div>
          <div className="border-t pt-3">
            <div className="text-sm text-gray-600">Итоговая стоимость:</div>
            <div className="text-2xl font-bold text-green-600">
              {(priceDetails.finalPrice || 0).toLocaleString()} ₸
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {flowerCount} цветов в букете
          </div>
        </div>
      </div>
    );
  };

  // Добавляем состояние для отслеживания процесса сохранения
  const [isSaving, setIsSaving] = useState(false);

  // Эффект для загрузки данных при просмотре или редактировании
  useEffect(() => {
    if (selectedProduct || editingProduct) {
      const product = selectedProduct || editingProduct;
      console.log('Loading product data:', product);

      try {
        // Загружаем состав букета
        const formattedComposition = product.product_compositions?.map(item => ({
          id: item.id,
          name: item.inventory?.products?.name || 'Неизвестный цветок',
          quantity: parseInt(item.quantity) || 0,
          price_per_stem: parseFloat(item.price_per_stem) || 0,
          inventory_item_id: item.inventory?.id
        })) || [];

        console.log('Formatted composition:', formattedComposition);

        // Обновляем состояния с сохранением всех данных
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          price: product.price || 0,
          base_price: product.base_price || 0,
          markup_amount: product.markup_amount || 0,
          packaging_cost: product.packaging_cost || 0
        });

        // Устанавливаем состав букета
        setComposition(formattedComposition);

        // Устанавливаем изображение, если оно есть
        if (product.image_url) {
          setMedia([{ id: 1, url: product.image_url }]);
        }

        // Пересчитываем итоговую цену
        const priceDetails = {
          basePrice: parseFloat(product.base_price) || 0,
          markupAmount: parseFloat(product.markup_amount) || 0,
          packagingCost: parseFloat(product.packaging_cost) || 0,
          finalPrice: parseFloat(product.price) || 0
        };
        
        console.log('Price details:', priceDetails);
        
        // Обновляем цены
        setBasePrice(priceDetails.basePrice);
        setMarkupAmount(priceDetails.markupAmount);
        setPackagingCost(priceDetails.packagingCost);
      } catch (error) {
        console.error('Error loading product data:', error);
      }
    }
  }, [selectedProduct, editingProduct]);

  // Обновляем заголовок
  const getTitle = () => {
    if (viewMode) return `Просмотр: ${selectedProduct.name}`;
    if (editingProduct) return `Редактирование: ${editingProduct.name}`;
    return 'Новый букет';
  };

  // Добавляем функцию удаления
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот букет?')) {
      // Здесь будет логика удаления
      console.log('Удаление букета:', editingProduct.id);
      onClose();
    }
  };

  // Обновляем секцию состава букета
  const renderComposition = () => (
    <div className="bg-white rounded-lg p-6 border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium flex items-center">
          <Flower size={18} className="mr-2 text-gray-500" />
          Состав букета
        </h2>
        {editingProduct && (
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Сохранить состав
          </button>
        )}
      </div>

      <div className="space-y-3">
        {composition.map((flower) => (
          <div key={flower.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{flower.name}</div>
                <div className="text-sm text-gray-500">
                  {(flower.pricePerStem || flower.price_per_stem ? parseFloat(flower.pricePerStem || flower.price_per_stem) : 0).toLocaleString()} ₸/шт
                </div>
              </div>
              <button 
                onClick={() => removeFlower(flower.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Доступно: {flower.maxQuantity} шт
              </div>
              <div className="flex items-center bg-white rounded-lg border">
                <button 
                  className="px-3 py-2 text-blue-500"
                  onClick={() => handleQuantityChange(flower.id, -1)}
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-medium">
                  {flower.quantity}
                </span>
                <button 
                  className="px-3 py-2 text-blue-500"
                  onClick={() => handleQuantityChange(flower.id, 1)}
                  disabled={flower.quantity >= flower.maxQuantity}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setShowFlowerSelector(true)}
          className="w-full py-3 px-4 rounded-lg border border-dashed border-gray-300 text-blue-500 flex items-center justify-center"
        >
          <Plus size={18} className="mr-2" />
          Добавить цветок
        </button>
      </div>
    </div>
  );

  const renderMarketingTab = () => (
    <div className="p-4 space-y-4">
      {/* Скидка */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Percent size={20} className="text-gray-500 mr-2" />
            <span className="font-medium">Скидка на букет</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={marketing.discount.enabled}
              onChange={(e) => setMarketing({
                ...marketing,
                discount: { ...marketing.discount, enabled: e.target.checked }
              })}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>

        {marketing.discount.enabled && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="number"
                className="w-full p-3 pr-8 border rounded-lg"
                placeholder="Размер скидки"
                value={marketing.discount.amount}
                onChange={(e) => setMarketing({
                  ...marketing,
                  discount: { ...marketing.discount, amount: e.target.value }
                })}
              />
              <div className="absolute right-3 top-3 text-gray-400">%</div>
            </div>

            <div>
              <div className="text-sm text-gray-600 mb-2">Действует до:</div>
              <input
                type="date"
                className="w-full p-3 border rounded-lg"
                value={marketing.discount.endDate}
                onChange={(e) => setMarketing({
                  ...marketing,
                  discount: { ...marketing.discount, endDate: e.target.value }
                })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Бесплатная досавка */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Truck size={20} className="text-gray-500 mr-2" />
            <span className="font-medium">Бесплатная доставка</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={marketing.freeDelivery.enabled}
              onChange={(e) => setMarketing({
                ...marketing,
                freeDelivery: { ...marketing.freeDelivery, enabled: e.target.checked }
              })}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>

        {marketing.freeDelivery.enabled && (
          <div>
            <div className="text-sm text-gray-600 mb-2">Действует до:</div>
            <input
              type="date"
              className="w-full p-3 border rounded-lg"
              value={marketing.freeDelivery.endDate}
              onChange={(e) => setMarketing({
                ...marketing,
                freeDelivery: { ...marketing.freeDelivery, endDate: e.target.value }
              })}
            />
          </div>
        )}
      </div>

      {/* Предпросмотр скидки */}
      {marketing.discount.enabled && marketing.discount.amount && (
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Цена со скидкой:</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-green-600">
              {(totalAmount * (1 - marketing.discount.amount / 100)).toLocaleString()} ₸
            </span>
            <span className="text-sm text-gray-500 line-through">
              {totalAmount.toLocaleString()} ₸
            </span>
          </div>
        </div>
      )}
    </div>
  );

  const renderGroupingTab = () => (
    <div className="p-4 space-y-4">
      {/* Список объединённых букетов */}
      <div className="space-y-2">
        {groupedBouquets.map(bouquet => (
          <div key={bouquet.id} className="bg-white p-3 rounded-lg border">
            <div className="flex gap-3">
              <div className="w-16 h-16">
                <img 
                  src={bouquet.image} 
                  alt={bouquet.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-medium">{bouquet.name}</h3>
                <div className="text-sm text-gray-500">{bouquet.description}</div>
                <div className="text-sm font-medium mt-1">{bouquet.price.toLocaleString()} ₸</div>
              </div>
              <button 
                onClick={() => setGroupedBouquets(groupedBouquets.filter(b => b.id !== bouquet.id))}
                className="text-gray-400 hover:text-red-500 self-start"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка обавления */}
      <button
        onClick={() => setShowProductSelector(true)}
        className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 text-blue-500 flex items-center justify-center"
      >
        <Plus size={18} className="mr-2" />
        Добать букет
      </button>

      {/* Подсказка */}
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-600">
        Объединяйте похожие букеты, чтобы показать их на одной странице. Например: классический букет роз и тот же букет, но в другом оформлении
      </div>
    </div>
  );

  const renderMainTab = () => (
    <div className="space-y-6">
      {/* Название букета */}
      <div className="bg-white rounded-lg p-6 border">
        <h2 className="font-medium mb-4">Название букета</h2>
        <input
          type="text"
          className="w-full p-3 border rounded-lg"
          placeholder="Введите название букета"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Категории */}
      <div className="bg-white rounded-lg p-6 border">
        <h2 className="font-medium mb-4">Категории букета</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => {
                if (selectedTags.includes(tag)) {
                  setSelectedTags(selectedTags.filter(t => t !== tag));
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag) 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Фото букета */}
      <div className="bg-white rounded-lg p-6 border">
        <h2 className="font-medium mb-4">Фотографии букета</h2>
        <div className="grid grid-cols-5 gap-4">
          {media.map(item => (
            <div key={item.id} className="relative aspect-square">
              <img
                src={item.url}
                alt="Товар"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full"
                onClick={() => setMedia(media.filter(m => m.id !== item.id))}
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {media.length < 5 && (
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer bg-white">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Добавить фото</span>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleMediaUpload}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Хедер */}
      <div className="sticky top-0 z-10">
        <div className="p-4 flex items-center bg-white border-b">
          <button onClick={onClose} className="mr-4 hover:bg-gray-100 p-2 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{getTitle()}</h1>
        </div>

        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto flex">
            <button
              onClick={() => setActiveTab('main')}
              className={`flex-1 py-3 text-center ${
                activeTab === 'main' 
                  ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
                  : 'text-gray-500'
              }`}
            >
              Основное
            </button>
            <button
              onClick={() => setActiveTab('marketing')}
              className={`flex-1 py-3 text-center ${
                activeTab === 'marketing' 
                  ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
                  : 'text-gray-500'
              }`}
            >
              Акции
            </button>
            <button
              onClick={() => setActiveTab('grouping')}
              className={`flex-1 py-3 text-center ${
                activeTab === 'grouping' 
                  ? 'border-b-2 border-blue-500 text-blue-500 font-medium' 
                  : 'text-gray-500'
              }`}
            >
              Объединение
            </button>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'main' && (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Левая колонка */}
              <div className="space-y-6">
                {renderMainTab()}
              </div>

              {/* Правая колонка */}
              <div className="space-y-6">
                {/* Состав букета */}
                <div className="bg-white rounded-lg p-6 border">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium flex items-center">
                      <Flower size={18} className="mr-2 text-gray-500" />
                      Состав букета
                    </h2>
                    <button 
                      onClick={() => setShowFlowerSelector(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Добавить цветок
                    </button>
                  </div>

                  <div className="space-y-3">
                    {composition.map((flower) => (
                      <div key={flower.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{flower.name}</div>
                            <div className="text-sm text-gray-500">
                              {(flower.pricePerStem || flower.price_per_stem ? parseFloat(flower.pricePerStem || flower.price_per_stem) : 0).toLocaleString()} ₸/шт
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFlower(flower.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Доступно: {flower.maxQuantity} шт
                          </div>
                          <div className="flex items-center bg-white rounded-lg border">
                            <button 
                              className="px-3 py-2 text-blue-500"
                              onClick={() => handleQuantityChange(flower.id, -1)}
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-12 text-center font-medium">
                              {flower.quantity}
                            </span>
                            <button 
                              className="px-3 py-2 text-blue-500"
                              onClick={() => handleQuantityChange(flower.id, 1)}
                              disabled={flower.quantity >= flower.maxQuantity}
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Расчет стоимости */}
                <PriceBreakdown />
              </div>
            </div>
          )}

          {activeTab === 'marketing' && (
            <div className="p-6 max-w-2xl mx-auto">
              {renderMarketingTab()}
            </div>
          )}

          {activeTab === 'grouping' && (
            <div className="p-6 max-w-2xl mx-auto">
              {renderGroupingTab()}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно выбора букета */}
      {showProductSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Выберите букет</h3>
              <button 
                onClick={() => setShowProductSelector(false)}
                className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pl-10 border rounded-lg"
                  placeholder="оиск букета..."
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
              </div>
            </div>
            
            <div className="space-y-2">
              {availableBouquets.map((bouquet) => (
                <button
                  key={bouquet.id}
                  onClick={() => {
                    setGroupedBouquets([...groupedBouquets, bouquet]);
                    setShowProductSelector(false);
                  }}
                  className="w-full py-3 px-4 bg-gray-50 rounded-lg text-left hover:bg-gray-100"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16">
                      <img 
                        src={bouquet.image} 
                        alt={bouquet.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{bouquet.name}</div>
                      <div className="text-sm text-gray-500">{bouquet.description}</div>
                      <div className="text-sm font-medium mt-1">{bouquet.price.toLocaleString()} ₸</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Добавляем модальное окно выбора цветов */}
      {showFlowerSelector && <FlowerSelectorModal />}

      {/* Обновленный футер */}
      <SaveCloseButtons 
        onSave={handleSave}
        onClose={onClose}
        isSaving={isSaving}
        viewMode={viewMode}
      />
    </div>
  );
};

export default ProductCard; 