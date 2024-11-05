import React, { useState } from 'react';
import { Settings } from 'lucide-react';

export default function StockManagement({ inventory, setInventory, showCosts, showInactive, onEditItem }) {
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [editingPrices, setEditingPrices] = useState({});

  const activeItems = inventory.filter(item => item.active);
  const inactiveItems = inventory.filter(item => !item.active);

  const handleQuantityChange = (id, newQuantity) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        return { ...item, quantity: parseInt(newQuantity) || 0 };
      }
      return item;
    }));
    setEditingQuantity(null);
  };

  const handlePriceChange = (itemId, field, value) => {
    const updatedInventory = inventory.map(item => {
      if (item.id === itemId) {
        const updates = { ...item, [field]: Number(value) };
        
        // Автоматический пересчет при изменении себестоимости или наценки
        if (field === 'costPrice' || field === 'markup') {
          updates.price = Math.round(updates.costPrice * (1 + updates.markup / 100));
        }
        
        return updates;
      }
      return item;
    });
    setInventory(updatedInventory);
  };

  const ItemList = ({ items, isInactive = false }) => (
    <>
      {items.map(item => (
        <tr key={item.id} className={isInactive ? 'text-gray-500' : ''}>
          <td className="px-6 py-4 whitespace-nowrap flex items-center justify-between">
            <span>{item.name}</span>
            <button
              onClick={() => onEditItem(item)}
              className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            {editingQuantity === item.id ? (
              <input
                type="number"
                className="w-24 p-2 border rounded text-right"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                onBlur={() => setEditingQuantity(null)}
                autoFocus
              />
            ) : (
              <div
                onClick={() => setEditingQuantity(item.id)}
                className="w-24 p-2 text-right cursor-pointer hover:bg-gray-50 rounded"
              >
                {item.quantity} шт.
              </div>
            )}
          </td>
          {showCosts && (
            <>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.costPrice} ₸
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.markup}%
              </td>
            </>
          )}
          <td className="px-6 py-4 whitespace-nowrap">
            {editingPrices[item.id] ? (
              <input
                type="number"
                className="w-24 p-2 border rounded text-right"
                value={item.price}
                onChange={(e) => handlePriceChange(item.id, 'price', e.target.value)}
                onBlur={() => setEditingPrices(null)}
                autoFocus
              />
            ) : (
              <div
                onClick={() => setEditingPrices(item.id)}
                className="w-24 p-2 text-right cursor-pointer hover:bg-gray-50 rounded"
              >
                {item.price} ₸
              </div>
            )}
          </td>
        </tr>
      ))}
    </>
  );

  // Мобильное представление
  const MobileView = () => (
    <div className="grid grid-cols-1 gap-3 md:hidden">
      {activeItems.map(item => (
        <div key={item.id} className="p-3 rounded-lg border bg-white">
          {/* Верхняя часть карточки */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <button
              onClick={() => onEditItem(item)}
              className="p-1.5 rounded-lg hover:bg-gray-100"
            >
              <Settings size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Количество - крупно и по центру */}
          <div className="my-2">
            {editingQuantity === item.id ? (
              <input
                type="number"
                className="w-full py-3 text-center text-2xl font-bold border rounded-lg"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                onBlur={() => setEditingQuantity(null)}
                autoFocus
              />
            ) : (
              <div
                onClick={() => setEditingQuantity(item.id)}
                className="w-full py-3 text-center text-2xl font-bold cursor-pointer hover:bg-gray-50 rounded-lg"
              >
                {item.quantity} шт
              </div>
            )}
          </div>

          {/* Нижняя часть карточки */}
          <div className="flex items-center justify-between text-sm">
            {showCosts ? (
              <div className="flex-1 grid grid-cols-3 gap-1 text-gray-600">
                <div className="text-center">
                  <div className="text-xs text-gray-400">Себест.</div>
                  <div>{item.costPrice}₸</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Наценка</div>
                  <div>{item.markup}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Цена</div>
                  <div className="font-semibold text-gray-900">{item.price}₸</div>
                </div>
              </div>
            ) : (
              <div className="flex-1 text-center font-semibold">
                {item.price}₸
              </div>
            )}
          </div>
        </div>
      ))}

      {showInactive && inactiveItems.length > 0 && (
        <>
          <div className="text-sm text-gray-500 mt-4 mb-2">
            Нет в наличии:
          </div>
          {inactiveItems.map(item => (
            <div key={item.id} className="p-3 rounded-lg border bg-gray-50">
              {/* Верхняя часть карточки */}
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-500">{item.name}</h3>
                <button
                  onClick={() => onEditItem(item)}
                  className="p-1.5 rounded-lg hover:bg-gray-200"
                >
                  <Settings size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Количество - крупно и по центру */}
              <div className="my-2">
                {editingQuantity === item.id ? (
                  <input
                    type="number"
                    className="w-full py-3 text-center text-2xl font-bold border rounded-lg bg-white"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    onBlur={() => setEditingQuantity(null)}
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => setEditingQuantity(item.id)}
                    className="w-full py-3 text-center text-2xl font-bold text-gray-500 cursor-pointer hover:bg-gray-100 rounded-lg"
                  >
                    {item.quantity} шт
                  </div>
                )}
              </div>

              {/* Нижняя часть карточки */}
              <div className="flex items-center justify-between text-sm">
                {showCosts ? (
                  <div className="flex-1 grid grid-cols-3 gap-1 text-gray-500">
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Себест.</div>
                      <div>{item.costPrice}₸</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Наценка</div>
                      <div>{item.markup}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-400">Цена</div>
                      <div className="font-semibold">{item.price}₸</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-center font-semibold text-gray-500">
                    {item.price}₸
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );

  // Десктопное представление
  const DesktopView = () => (
    <div className="hidden md:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Наименование
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Количество
            </th>
            {showCosts && (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Себестоимость
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наценка
                </th>
              </>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Цена
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <ItemList items={activeItems} />
          {inactiveItems.length > 0 && (
            <>
              <tr>
                <td colSpan={showCosts ? 5 : 3} className="px-6 py-3 text-gray-500">
                  Нет в наличии:
                </td>
              </tr>
              <ItemList items={inactiveItems} isInactive={true} />
            </>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}