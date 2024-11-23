import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const FlowerSelector = ({ onSelect }) => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('status', 'active')
        .gt('stock', 0)
        .order('name');

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      {/* Поиск */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Поиск цветов..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Список цветов */}
      <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">Загрузка...</div>
        ) : filteredInventory.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Ничего не найдено</div>
        ) : (
          filteredInventory.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(item)}
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500">
                  {item.price} ₸ / {item.unit} • В наличии: {item.stock}
                </div>
              </div>
              <Plus size={20} className="text-blue-500" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FlowerSelector;
