import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, ArrowLeft, Upload, Truck, Percent, Calendar, Flower, Search } from 'lucide-react';

const ProductCard = ({ onClose, editingProduct = null }) => {
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

      {/* Бесплатная доставка */}
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

      {/* Кнопка добавления */}
      <button
        onClick={() => setShowProductSelector(true)}
        className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 text-blue-500 flex items-center justify-center"
      >
        <Plus size={18} className="mr-2" />
        Добавить букет
      </button>

      {/* Подсказка */}
      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-600">
        Объединяйте похожие букеты, чтобы показать их на одной странице. Например: классический букет роз и тот же букет, но в другом оформлении
      </div>
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки данных
    console.log({
      ...formData,
      media,
      composition,
      selectedTags,
      totalAmount
    });
    onClose();
  };

  // Инициализируем состояния данными редактируемого товара
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        description: editingProduct.description,
        images: editingProduct.images || []
      });
      setMedia(editingProduct.media || []);
      setSelectedTags(editingProduct.tags || []);
      setComposition(editingProduct.composition || []);
      // ... инициализация других состояний
    }
  }, [editingProduct]);

  // Обновляем заголовок в зависимости от режима
  const title = editingProduct ? `Редактирование: ${editingProduct.name}` : 'Новый букет';

  // Добавляем функцию удаления
  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этот букет?')) {
      // Здесь будет логика удаления
      console.log('Удаление букета:', editingProduct.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Хедер */}
      <div className="sticky top-0 z-10">
        <div className="p-4 flex items-center bg-white border-b">
          <button onClick={onClose} className="mr-4 hover:bg-gray-100 p-2 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">{title}</h1>
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
                {/* Состав букета */}
                <div className="bg-white rounded-lg p-6 border">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-medium flex items-center">
                      <Flower size={18} className="mr-2 text-gray-500" />
                      Состав букета
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {composition.map((flower) => (
                      <div key={flower.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{flower.name}</div>
                            <div className="text-sm text-gray-500">{flower.length} см</div>
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
                            {flower.pricePerStem} ₸/шт
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
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button className="w-full py-3 px-4 rounded-lg border border-dashed border-gray-300 text-blue-500 flex items-center justify-center">
                      <Plus size={18} className="mr-2" />
                      Добавить цветок
                    </button>
                  </div>
                </div>

                {/* Итоговая цена */}
                <div className="bg-white p-6 rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Итоговая стоимость:</div>
                  <div className="text-2xl font-bold text-green-600">
                    {totalAmount.toLocaleString()} ₸
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {composition.reduce((sum, flower) => sum + flower.quantity, 0)} цветов в букете
                  </div>
                </div>
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
                  placeholder="Поиск букета..."
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

      {/* Обновленный футер */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <div className="max-w-6xl mx-auto flex justify-between">
          <div>
            {editingProduct && (
              <button 
                onClick={handleDelete}
                className="px-6 py-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                Удалить букет
              </button>
            )}
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            >
              Отмена
            </button>
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              {editingProduct ? 'Сохранить изменения' : 'Создать букет'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 