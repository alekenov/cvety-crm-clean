import React from 'react';
import { useSelector } from 'react-redux';
import { Edit, Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '../common';

const InventoryTable = () => {
  const { items, filters } = useSelector(state => state.inventory);

  const filteredItems = items.filter(item => {
    if (filters.category !== 'all' && item.category !== filters.category) {
      return false;
    }
    if (!filters.showEmpty && item.quantity === 0) {
      return false;
    }
    return true;
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Количество
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Цена (₸)
            </th>
            {filters.showCostInfo && (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Себестоимость (₸)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Наценка (%)
                </th>
              </>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredItems.map(item => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
              {filters.showCostInfo && (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">{item.cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {((item.price - item.cost) / item.cost * 100).toFixed(0)}%
                  </td>
                </>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={<Plus size={16} />}>
                    Приход
                  </Button>
                  <Button variant="outline" size="sm" icon={<Minus size={16} />}>
                    Расход
                  </Button>
                  <Button variant="outline" size="sm" icon={<Edit size={16} />}>
                    Изменить
                  </Button>
                  <Button variant="outline" size="sm" icon={<Trash2 size={16} />}>
                    Удалить
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable; 