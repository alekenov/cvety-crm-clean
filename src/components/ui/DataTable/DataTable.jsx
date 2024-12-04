import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Minus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Body } from '@/components/ui/Typography';
import { cn } from '@/lib/utils';

const DataTable = ({ 
  data = [], 
  columns = [], 
  searchPlaceholder = 'Search...', 
  onEdit,
  onDelete,
  onQuantityChange,
  renderMobileItem,
  className = ''
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Проверяем размер экрана при монтировании и изменении размера окна
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Фильтрация данных при изменении поискового запроса
  useEffect(() => {
    const filtered = data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredData(filtered);
  }, [data, searchQuery]);

  const handleQuantityAdjust = (item, delta) => {
    const newQuantity = Math.max(0, item.quantity + delta);
    onQuantityChange?.(item, newQuantity);
  };

  // Мобильный вид
  if (isMobile) {
    return (
      <div className={cn('space-y-4', className)}>
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />
        
        <div className="space-y-4">
          {filteredData.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow p-4 space-y-4"
            >
              {/* Основная информация */}
              <div className="flex justify-between items-start">
                <div>
                  <Body weight="medium" className="text-gray-900">
                    {item.name}
                  </Body>
                  <Body size="sm" className="text-gray-500 mt-1">
                    {item.type}
                  </Body>
                </div>
                <div className="flex gap-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Количество и цена */}
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <div className="space-y-1">
                  <Body size="sm" className="text-gray-500">
                    Количество
                  </Body>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityAdjust(item, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Body weight="medium">
                      {item.quantity} {item.unit}
                    </Body>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityAdjust(item, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <Body size="sm" className="text-gray-500">
                    Цена
                  </Body>
                  <Body weight="medium">
                    {item.price}
                  </Body>
                </div>
              </div>

              {/* Статус */}
              <div>
                {columns.find(col => col.key === 'status')?.render?.(item.status, item)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Десктопный вид (таблица)
  return (
    <div className={cn('space-y-4', className)}>
      <Input
        type="text"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4"
      />
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'py-3 px-4 text-left text-sm font-medium text-gray-500',
                    column.align === 'center' && 'text-center'
                  )}
                >
                  {column.label}
                </th>
              ))}
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'py-4 px-4',
                      column.align === 'center' && 'text-center'
                    )}
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
                <td className="py-4 px-4">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
