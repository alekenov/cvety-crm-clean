import React, { useState, useEffect } from 'react';
import { Package, Search, Edit2, Trash2, Plus, ClipboardCheck, Check, X, Percent, DollarSign, Calendar, Box } from 'lucide-react';

export default function StockManagement({ inventory, onUpdateInventory }) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInventoryMode, setIsInventoryMode] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState(false);
  const [editQuantity, setEditQuantity] = useState(false);
  const [tempPrice, setTempPrice] = useState('');
  const [tempQuantity, setTempQuantity] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');

  // Состояния для ревизии
  const [revisionItems, setRevisionItems] = useState(
    inventory.map(item => ({
      id: item.id,
      name: item.name,
      expected: item.quantity,
      actual: null,
      price: item.price,
      lastRevision: '2024-03-21',
      difference: null
    }))
  );

  const handleActualChange = (id, value) => {
    setRevisionItems(items => items.map(item => {
      if (item.id === id) {
        const actual = value === '' ? null : Number(value);
        const difference = actual === null ? null : actual - item.expected;
        return { ...item, actual, difference };
      }
      return item;
    }));
  };

  const getItemStatus = (item) => {
    if (item.actual === null) return 'pending';
    if (item.actual === item.expected) return 'match';
    return item.actual > item.expected ? 'excess' : 'shortage';
  };

  const getTotalDifference = () => {
    const shortage = revisionItems.reduce((sum, item) => {
      if (item.difference && item.difference < 0) {
        return sum + (item.difference * item.price);
      }
      return sum;
    }, 0);

    const excess = revisionItems.reduce((sum, item) => {
      if (item.difference && item.difference > 0) {
        return sum + (item.difference * item.price);
      }
      return sum;
    }, 0);

    return { shortage: Math.abs(shortage), excess };
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculatePrice = (costPrice, markup) => {
    return Math.round(costPrice * (1 + markup / 100));
  };

  // Добавим функцию для записи в историю
  const addToHistory = (type, items, comment) => {
    const newOperation = {
      id: Date.now(),
      type,
      date: new Date().toISOString(),
      comment,
      operator: {
        id: 1,
        name: 'Оператор',
        role: 'Менеджер'
      },
      items
    };
    // Здесь нужно добавить запись в историю через пропсы или контекст
    // onAddHistory(newOperation);
  };

  // Обновим функцию удаления
  const handleDelete = (id) => {
    const productToDelete = inventory.find(item => item.id === id);
    if (window.confirm('Удалить товар?')) {
      onUpdateInventory(inventory.filter(item => item.id !== id));
      addToHistory('writeoff', [{
        id: productToDelete.id,
        name: productToDelete.name,
        quantity: productToDelete.quantity,
        price: productToDelete.price
      }], 'Удаление позиции');
    }
  };

  // Обновим функцию добавления
  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: 'Новый товар',
      quantity: 0,
      price: 0,
      costPrice: 0,
      markup: 30,
      active: true
    };
    onUpdateInventory([...inventory, newProduct]);
    addToHistory('in', [{
      id: newProduct.id,
      name: newProduct.name,
      quantity: 0,
      price: 0
    }], 'Добавлена новая позиция');
  };

  // Обновим функцию завершения ревизии
  const handleCompleteRevision = () => {
    const differences = revisionItems
      .filter(item => item.actual !== null && item.difference !== 0)
      .map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.difference,
        price: item.price
      }));

    if (differences.length > 0) {
      addToHistory('revision', differences, 'Проведена ревизия склада');
    }

    onUpdateInventory(
      inventory.map(item => {
        const revisionItem = revisionItems.find(ri => ri.id === item.id);
        return revisionItem?.actual !== null
          ? { ...item, quantity: revisionItem.actual }
          : item;
      })
    );
    setIsInventoryMode(false);
  };

  const handleUpdateProduct = (id, field, value) => {
    onUpdateInventory(
      inventory.map(item =>
        item.id === id ? { ...item, [field]: Number(value) } : item
      )
    );
  };

  const handlePriceBlur = (id) => {
    handleUpdateProduct(id, 'price', tempPrice);
    setEditPrice(false);
    setEditingId(null);
  };

  const handleQuantityBlur = (id) => {
    handleUpdateProduct(id, 'quantity', tempQuantity);
    setEditQuantity(false);
    setEditingId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'match': return 'text-green-600 bg-green-50';
      case 'excess': return 'text-blue-600 bg-blue-50';
      case 'shortage': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Компонент для отображения товара в режиме ревизии
  const RevisionItem = ({ item }) => {
    const status = getItemStatus(item);
    const statusColor = getStatusColor(status);

    return (
      <div className="bg-white rounded-lg p-4 mb-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-500">
              По учету: {item.expected} шт
            </p>
          </div>
          <div className="text-right">
            <input
              type="number"
              value={item.actual === null ? '' : item.actual}
              onChange={(e) => handleActualChange(item.id, e.target.value)}
              placeholder="0"
              className="w-20 p-2 border rounded text-right"
            />
            <span className="text-sm text-gray-500 ml-1">шт</span>
          </div>
        </div>
        
        {item.actual !== null && (
          <div className={`flex justify-between items-center px-2 py-1 rounded ${statusColor}`}>
            <span className="text-sm">
              {status === 'match' && 'Совпадает'}
              {status === 'excess' && `Излишек: +${item.difference} шт`}
              {status === 'shortage' && `Недостача: ${item.difference} шт`}
            </span>
            {(status === 'excess' || status === 'shortage') && (
              <span className="text-sm font-medium">
                {Math.abs(item.difference * item.price).toLocaleString()} ₸
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // Компонент для отображения товара в обычном режиме
  const ProductCard = ({ product }) => {
    const [editingField, setEditingField] = useState(null);
    const [tempValue, setTempValue] = useState('');

    const handleEdit = (field, value) => {
      setEditingField(field);
      setTempValue(value.toString());
    };

    const handleSave = (field) => {
      handleUpdateProduct(product.id, field, tempValue);
      setEditingField(null);
    };

    return (
      <div className={`bg-white rounded-lg p-3 mb-2 shadow-sm ${!product.active && 'opacity-60'}`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">{product.name}</h3>
          {!isInventoryMode && (
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setEditedProduct({...product});
                  setIsEditing(true);
                }}
                className="p-1 text-gray-400 hover:text-blue-500"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(product.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          {editingField === 'price' ? (
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => handleSave('price')}
              className="w-24 p-2 border rounded text-lg"
              autoFocus
            />
          ) : (
            <div 
              className="text-lg cursor-pointer hover:text-blue-600"
              onClick={() => handleEdit('price', product.price)}
            >
              {product.price} тг
            </div>
          )}

          {editingField === 'quantity' ? (
            <input
              type="number"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={() => handleSave('quantity')}
              className="w-20 p-2 border rounded text-lg text-right"
              autoFocus
            />
          ) : (
            <div 
              className="text-lg font-bold cursor-pointer hover:text-blue-600"
              onClick={() => handleEdit('quantity', product.quantity)}
            >
              {product.quantity} шт
            </div>
          )}
        </div>
      </div>
    );
  };

  const activeProducts = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    item.active
  );

  const inactiveProducts = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !item.active
  );

  // Добавим компонент формы редактирования
  const EditProductForm = ({ product, onSave, onCancel }) => {
    const [editedProduct, setEditedProduct] = useState({...product});

    return (
      <div className="bg-white rounded-lg p-3 mb-2 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <input
            type="text"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
            className="font-semibold p-2 border rounded flex-grow mr-2"
          />
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                const newPrice = calculatePrice(editedProduct.costPrice, editedProduct.markup);
                onSave({...editedProduct, price: newPrice});
              }}
              className="p-2 bg-green-100 text-green-600 rounded-lg"
            >
              <Check size={16} />
            </button>
            <button 
              onClick={onCancel}
              className="p-2 bg-gray-100 text-gray-600 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Себестоимость (тг)</label>
            <input
              type="number"
              value={editedProduct.costPrice}
              onChange={(e) => setEditedProduct({
                ...editedProduct,
                costPrice: Number(e.target.value)
              })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Наценка (%)</label>
            <div className="relative">
              <input
                type="number"
                value={editedProduct.markup}
                onChange={(e) => setEditedProduct({
                  ...editedProduct,
                  markup: Number(e.target.value)
                })}
                className="w-full p-2 border rounded"
              />
              <Percent 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Итоговая цена:</div>
          <div className="text-xl font-bold text-green-600">
            {calculatePrice(editedProduct.costPrice, editedProduct.markup)} тг
          </div>
        </div>
      </div>
    );
  };

  // Статистика склада
  const getInventoryStats = () => {
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => item.quantity < 50).length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const lastRevisionDate = '2024-03-21'; // В реальном приложении брать из БД

    return { totalItems, lowStockItems, totalValue, lastRevisionDate };
  };

  // Обновим компонент статистики
  const StatsCards = () => {
    const stats = getInventoryStats();

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего позиций</p>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
            </div>
            <Box className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Стоимость склада</p>
              <p className="text-2xl font-bold text-green-500">{stats.totalValue.toLocaleString()} ₸</p>
            </div>
            <DollarSign className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Последняя ревизия</p>
              <p className="text-2xl font-bold">{new Date(stats.lastRevisionDate).toLocaleDateString()}</p>
            </div>
            <Calendar className="text-purple-500" size={24} />
          </div>
        </div>
      </div>
    );
  };

  // Обновим DesktopTable для отображения разницы при ревизии
  const DesktopTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-3 text-left">Наименование</th>
            <th className="p-3 text-right">
              {isInventoryMode ? 'По учету' : 'Количество'}
            </th>
            {isInventoryMode ? (
              <>
                <th className="p-3 text-right">Фактически</th>
                <th className="p-3 text-right">Разница</th>
              </>
            ) : (
              <>
                <th className="p-3 text-right">Себестоимость</th>
                <th className="p-3 text-right">Наценка</th>
              </>
            )}
            <th className="p-3 text-right">Цена</th>
            <th className="p-3 text-center">Действия</th>
          </tr>
        </thead>
        <tbody>
          {/* Активные товары */}
          {(isInventoryMode ? revisionItems : activeProducts).map(item => (
            <tr key={item.id} className="border-b">
              <td className="p-3">{item.name}</td>
              <td className="p-3 text-right">
                {isInventoryMode ? (
                  `${item.expected} шт`
                ) : (
                  <div className="flex justify-end">
                    <input
                      type="number"
                      value={editQuantity && item.id === editingId ? tempQuantity : item.quantity}
                      onChange={(e) => {
                        if (item.id === editingId) {
                          setTempQuantity(e.target.value);
                        } else {
                          setEditingId(item.id);
                          setTempQuantity(e.target.value);
                          handleUpdateProduct(item.id, 'quantity', e.target.value);
                        }
                      }}
                      className="w-20 p-1 text-right border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    <span className="ml-1">шт</span>
                  </div>
                )}
              </td>
              {isInventoryMode ? (
                <>
                  <td className="p-3 text-right">
                    <input
                      type="number"
                      value={item.actual === null ? '' : item.actual}
                      onChange={(e) => handleActualChange(item.id, e.target.value)}
                      className="w-20 p-1 border rounded text-right"
                      placeholder="0"
                    />
                  </td>
                  <td className="p-3 text-right">
                    {item.actual !== null && (
                      <div className={`text-sm ${
                        item.difference === 0 
                          ? 'text-green-600' 
                          : item.difference > 0 
                            ? 'text-blue-600' 
                            : 'text-red-600'
                      }`}>
                        {item.difference === 0 
                          ? 'Совпадает'
                          : item.difference > 0 
                            ? `+${item.difference} шт (${(item.difference * item.price).toLocaleString()} ₸)`
                            : `${item.difference} шт (${(Math.abs(item.difference * item.price)).toLocaleString()} ₸)`
                        }
                      </div>
                    )}
                  </td>
                </>
              ) : (
                <>
                  <td className="p-3 text-right">{item.costPrice} тг</td>
                  <td className="p-3 text-right">{item.markup}%</td>
                </>
              )}
              <td className="p-3 text-right">
                {isInventoryMode ? (
                  `${item.price} тг`
                ) : (
                  <div className="flex justify-end">
                    <input
                      type="number"
                      value={editPrice && item.id === editingId ? tempPrice : item.price}
                      onChange={(e) => {
                        if (item.id === editingId) {
                          setTempPrice(e.target.value);
                        } else {
                          setEditingId(item.id);
                          setTempPrice(e.target.value);
                          handleUpdateProduct(item.id, 'price', e.target.value);
                        }
                      }}
                      className="w-24 p-1 text-right border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none"
                    />
                    <span className="ml-1">тг</span>
                  </div>
                )}
              </td>
              <td className="p-3 text-center">
                <div className="flex justify-center space-x-2">
                  {!isInventoryMode && (
                    <>
                      <button 
                        onClick={() => {
                          setEditedProduct({...item});
                          setIsEditing(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {/* Неактивные товары */}
          {!isInventoryMode && inactiveProducts.length > 0 && (
            <>
              <tr>
                <td colSpan="6" className="p-3 bg-gray-50">
                  <div className="text-sm text-gray-500">Нет в наличии</div>
                </td>
              </tr>
              {inactiveProducts.map(item => (
                <tr key={item.id} className="border-b bg-gray-50">
                  {/* Те же ячейки, что и выше */}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`${isDesktop ? 'p-6' : 'max-w-md mx-auto p-4'} bg-gray-100 min-h-screen`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Package className="text-blue-500 mr-2" size={24} />
          <h1 className="text-xl font-bold">Склад</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const newProduct = {
                id: Date.now(),
                name: 'Новый товар',
                quantity: 0,
                price: 0,
                costPrice: 0,
                markup: 30,
                active: true
              };
              onUpdateInventory([...inventory, newProduct]);
            }}
            className="p-2 bg-green-500 text-white rounded-lg flex items-center"
          >
            <Plus size={20} className="mr-1" />
            <span>Добавить</span>
          </button>
          {!isInventoryMode ? (
            <>
              <button
                onClick={() => setIsInventoryMode(true)}
                className="p-2 bg-blue-500 text-white rounded-lg flex items-center"
              >
                <ClipboardCheck size={20} className="mr-1" />
                <span>Ревизия</span>
              </button>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 bg-white rounded-lg"
              >
                <Search size={20} className="text-gray-600" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsInventoryMode(false)}
              className="p-2 bg-green-500 text-white rounded-lg flex items-center"
            >
              <Check size={20} className="mr-1" />
              <span>Завершить</span>
            </button>
          )}
        </div>
      </div>

      {showSearch && !isInventoryMode && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border"
          />
        </div>
      )}

      {isDesktop ? (
        <div className="bg-white rounded-lg shadow-sm">
          <DesktopTable />
        </div>
      ) : (
        <div>
          {isInventoryMode ? (
            // Отображение ревизии
            <>
              {/* Прогресс ревизии */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Проверено: {revisionItems.filter(item => item.actual !== null).length} из {revisionItems.length}</span>
                  <span>{Math.round((revisionItems.filter(item => item.actual !== null).length / revisionItems.length) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${(revisionItems.filter(item => item.actual !== null).length / revisionItems.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Список товаров для ревизии */}
              {revisionItems
                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(item => (
                  <RevisionItem key={item.id} item={item} />
                ))
              }
            </>
          ) : (
            // Обычное отображение товаров
            <>
              {activeProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
              {inactiveProducts.length > 0 && (
                <div className="mt-6">
                  <div className="text-sm text-gray-500 mb-2">Нет в наличии</div>
                  {inactiveProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <EditProductForm 
              product={editedProduct}
              onSave={(updatedProduct) => {
                onUpdateInventory(
                  inventory.map(item =>
                    item.id === updatedProduct.id ? updatedProduct : item
                  )
                );
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      )}
      <StatsCards />
    </div>
  );
} 