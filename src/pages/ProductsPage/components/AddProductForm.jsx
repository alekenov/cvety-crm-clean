import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, ArrowLeft, Upload, Truck, Percent, Calendar, Flower, Search } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

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

const ProductCard = ({ onClose, editingProduct = null, viewMode = false, selectedProduct = null }) => {
  console.log('ProductCard props:', { editingProduct, viewMode, selectedProduct }); // Для отладки
  
  const [activeTab, setActiveTab] = useState('main');
  const [media, setMedia] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [composition, setComposition] = useState([
    { 
      id: 1,
      name: "Роза Red Naomi",
      length: 60,
      quantity: 25,
      pricePerStem: 400
    },
    {
      id: 2,
      name: "Гипсофила",
      length: 50,
      quantity: 3,
      pricePerStem: 350
    }
  ]);

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
    category: '',
    price: '',
    description: '',
    images: []
  });

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file)
    }));
    setMedia([...media, ...files]);
  };

  const handleQuantityChange = (flowerId, change) => {
    setComposition(composition.map(flower => 
      flower.id === flowerId 
        ? { ...flower, quantity: Math.max(1, flower.quantity + change) }
        : flower
    ));
  };

  const removeFlower = (flowerId) => {
    setComposition(composition.filter(flower => flower.id !== flowerId));
  };

  const totalAmount = composition.reduce((sum, flower) => 
    sum + (flower.quantity * flower.pricePerStem), 0
  );

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
      const formattedData = data.map(item => ({
        id: item.id,
        name: item.products.name,
        price: item.products.price,
        quantity: item.quantity,
        product_id: item.products.id
      }));

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
  const handleAddFlower = (flower) => {
    const existingFlower = composition.find(f => f.id === flower.id);
    
    if (existingFlower) {
      setComposition(composition.map(f => 
        f.id === flower.id 
          ? { ...f, quantity: Math.min(f.quantity + 1, flower.quantity) }
          : f
      ));
    } else {
      setComposition([...composition, {
        id: flower.id,
        name: flower.name,
        pricePerStem: flower.price,
        quantity: 1,
        maxQuantity: flower.quantity,
        product_id: flower.product_id
      }]);
    }
    setShowFlowerSelector(false);
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
                        {flower.price.toLocaleString()} ₸/шт
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

  // Обновлем расчет итоговой стоимости
  const calculateFinalPrice = () => {
    // Базовая стоимость (сумма всех цветов)
    const basePrice = composition.reduce((sum, flower) => 
      sum + (flower.quantity * flower.pricePerStem), 0
    );

    // Добавляем наценку за работу (30% по умолчанию)
    const markup = 30;
    const markupAmount = basePrice * (markup / 100);

    // Добавляем стоимость упаковки (фиксированная)
    const packagingCost = 2000; // Стоимость упаковки

    // Итоговая стоимость
    const finalPrice = basePrice + markupAmount + packagingCost;

    return {
      basePrice,
      markupAmount,
      packagingCost,
      finalPrice
    };
  };

  // Используем расчет цены
  const priceDetails = calculateFinalPrice();

  // Обновляем отображене итоговой цены
  const PriceBreakdown = () => (
    <div className="bg-white p-6 rounded-lg border">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Стоимость цветов:</span>
          <span>{priceDetails.basePrice.toLocaleString()} ₸</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Работа флориста (30%):</span>
          <span>{priceDetails.markupAmount.toLocaleString()} ₸</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Упаковка:</span>
          <span>{priceDetails.packagingCost.toLocaleString()} ₸</span>
        </div>
        <div className="border-t pt-3">
          <div className="text-sm text-gray-600">Итоговая стоимость:</div>
          <div className="text-2xl font-bold text-green-600">
            {priceDetails.finalPrice.toLocaleString()} ₸
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {composition.reduce((sum, flower) => sum + flower.quantity, 0)} цветов в букете
        </div>
      </div>
    </div>
  );

  // Добавляем состояние для отслеживания процесса сохранения
  const [isSaving, setIsSaving] = useState(false);

  // Обновляем функцию сохранения
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const priceDetails = calculateFinalPrice();
      
      // Данные для сохранения
      const productData = {
        name: formData.name || selectedProduct?.name || editingProduct?.name,
        category: formData.category || selectedProduct?.category || editingProduct?.category || 'Букеты',
        price: priceDetails.finalPrice,
        description: formData.description || selectedProduct?.description || editingProduct?.description,
        status: 'active',
        image_url: media[0]?.url || selectedProduct?.image_url || editingProduct?.image_url,
        base_price: priceDetails.basePrice,
        markup_amount: priceDetails.markupAmount,
        packaging_cost: priceDetails.packagingCost
      };

      // Определяем ID продукта для обновления
      const productId = editingProduct?.id || selectedProduct?.id;

      if (productId) {
        // Обновляем существующий букет
        console.log('Updating existing product:', productId);
        
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId)
          .select()
          .single();

        if (error) throw error;

        // Удаляем старый состав
        const { error: deleteError } = await supabase
          .from('product_compositions')
          .delete()
          .eq('product_id', productId);

        if (deleteError) throw deleteError;

        // Добавляем новый состав
        if (composition.length > 0) {
          const compositionData = composition.map(flower => ({
            product_id: productId,
            inventory_item_id: flower.id,
            quantity: flower.quantity,
            price_per_stem: flower.pricePerStem
          }));

          const { error: compositionError } = await supabase
            .from('product_compositions')
            .insert(compositionData);

          if (compositionError) throw compositionError;
        }
      } else {
        // Создаем новый букет
        console.log('Creating new product');
        
        const { data, error } = await supabase
          .from('products')
          .insert([{
            ...productData,
            sku: `BQT-${Date.now()}`
          }])
          .select()
          .single();

        if (error) throw error;

        // Сохраняем состав для нового букета
        if (composition.length > 0) {
          const compositionData = composition.map(flower => ({
            product_id: data.id,
            inventory_item_id: flower.id,
            quantity: flower.quantity,
            price_per_stem: flower.pricePerStem
          }));

          const { error: compositionError } = await supabase
            .from('product_compositions')
            .insert(compositionData);

          if (compositionError) throw compositionError;
        }
      }

      alert('Букет успешно сохранен');
      onClose();
    } catch (error) {
      console.error('Error saving bouquet:', error);
      alert(`Ошибка при сохранении: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Обновляем загрузку данных при редактровании
  useEffect(() => {
    const loadProductDetails = async (product) => {
      try {
        // Загружаем состав букета
        const { data: compositions, error: compositionError } = await supabase
          .from('product_compositions')
          .select(`
            *,
            inventory:inventory_item_id (
              id,
              quantity,
              products (
                name,
                price
              )
            )
          `)
          .eq('product_id', product.id);

        if (compositionError) throw compositionError;

        // Преобразуем данные в нужный формат
        const formattedComposition = compositions.map(item => ({
          id: item.inventory.id,
          name: item.inventory.products.name,
          quantity: item.quantity,
          pricePerStem: item.price_per_stem,
          maxQuantity: item.inventory.quantity + item.quantity
        }));

        // Обновляем состояния
        setFormData({
          name: product.name,
          category: product.category,
          description: product.description
        });
        setComposition(formattedComposition);
        if (product.image_url) {
          setMedia([{ id: 1, url: product.image_url }]);
        }
      } catch (error) {
        console.error('Error loading product details:', error);
      }
    };

    // Загружаем данные если это редактирование или просмотр
    if (editingProduct || selectedProduct) {
      loadProductDetails(editingProduct || selectedProduct);
    }
  }, [editingProduct, selectedProduct]);

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
                  {flower.pricePerStem.toLocaleString()} ₸/шт
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

              {/* Правая колонка */}
              <div className="space-y-6">
                {renderComposition()}
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