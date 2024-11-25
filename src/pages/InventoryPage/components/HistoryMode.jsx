import React, { useState, useEffect } from 'react';
import { Package, Search, ArrowDown, ArrowUp, Calendar, Filter, History, Box, Trash, FileText, User, ExternalLink, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { inventoryHistoryService } from '../../../services/inventory/inventoryHistoryService';
import { logger } from '../../../services/logging/loggingService';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Button } from '../../../components/ui/button';
import { Input } from '@/components/ui/Input';
import { Select } from '../../../components/ui/select';
import { toast } from 'react-hot-toast';

const ITEMS_PER_PAGE = 10;

const HistoryMode = ({ onBack }) => {
  // Состояние
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Фильтры
  const [filters, setFilters] = useState({
    operationType: null,
    startDate: null,
    endDate: null,
    flowerName: '',
    showFilters: false
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        logger.log('HistoryMode', 'Starting history fetch', { 
          page: currentPage, 
          pageSize: ITEMS_PER_PAGE,
          filters 
        });

        const { data, total } = await inventoryHistoryService.getHistory({
          page: currentPage,
          pageSize: ITEMS_PER_PAGE,
          operationType: filters.operationType,
          startDate: filters.startDate,
          endDate: filters.endDate,
          flowerName: filters.flowerName || null
        });

        if (!data) {
          throw new Error('No data received from service');
        }

        setHistory(data);
        setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
        
        logger.log('HistoryMode', 'Successfully fetched history', { 
          itemsCount: data.length, 
          totalPages: Math.ceil(total / ITEMS_PER_PAGE),
          filters
        });
      } catch (error) {
        logger.error('HistoryMode', 'Error fetching history', { 
          error: error.message,
          stack: error.stack,
          name: error.name,
          filters,
          page: currentPage
        });
        toast.error(`Ошибка при загрузке истории: ${error.message}`);
        setHistory([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage, filters]);

  // Обработчики фильтров
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    logger.log('Applying inventory history filters', { newFilters });
    setFilters(newFilters);
    setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
  };

  // Вспомогательные функции
  const getOperationColor = (type) => {
    switch(type) {
      case 'RECEIPT': return 'text-green-600';
      case 'ORDER_USE': return 'text-blue-600';
      case 'WRITEOFF': return 'text-red-600';
      case 'RETURN': return 'text-yellow-600';
      case 'ADJUSTMENT': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const getOperationIcon = (type) => {
    switch(type) {
      case 'RECEIPT': return <ArrowDown size={16} />;
      case 'ORDER_USE': return <ArrowUp size={16} />;
      case 'WRITEOFF': return <Trash size={16} />;
      case 'RETURN': return <ArrowDown size={16} />;
      case 'ADJUSTMENT': return <Package size={16} />;
      default: return null;
    }
  };

  const getOperationName = (type) => {
    switch(type) {
      case 'RECEIPT': return 'Приход';
      case 'ORDER_USE': return 'Использование в заказе';
      case 'WRITEOFF': return 'Списание';
      case 'RETURN': return 'Возврат';
      case 'ADJUSTMENT': return 'Корректировка';
      default: return type;
    }
  };

  // Компонент карточки операции
  const OperationCard = ({ operation }) => {
    const [showDetails, setShowDetails] = useState(false);
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-2">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            {/* Тип операции */}
            <div className={`flex items-center ${getOperationColor(operation.operation_type)}`}>
              {getOperationIcon(operation.operation_type)}
              <span className="ml-2 font-medium">
                {getOperationName(operation.operation_type)}
              </span>
            </div>

            {/* Дата и время */}
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Calendar size={14} className="mr-1" />
              <span>
                {format(new Date(operation.operation_date), 'dd MMMM yyyy, HH:mm', { locale: ru })}
              </span>
            </div>

            {/* Комментарий */}
            {operation.comment && (
              <p className="text-sm text-gray-600 mt-1">
                {operation.comment}
              </p>
            )}

            {/* Состав */}
            <div className="mt-3">
              {operation.items.length === 1 ? (
                <div className="font-medium">
                  {operation.items[0].flower_name} - {operation.items[0].quantity} шт × {operation.items[0].price} ₸
                </div>
              ) : (
                <div>
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center text-blue-600"
                  >
                    {showDetails ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        <span className="text-sm">Скрыть состав</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        <span className="text-sm">Показать состав ({operation.items.length})</span>
                      </>
                    )}
                  </button>
                  
                  {showDetails && (
                    <div className="mt-2 space-y-2">
                      {operation.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.flower_name} ({item.stem_length} см)
                          </span>
                          <span className="font-medium">
                            {item.quantity} шт × {item.price} ₸
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">История операций</h2>
        </div>
      </div>

      {/* Фильтры */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
          className="flex items-center"
        >
          <Filter size={16} className="mr-2" />
          {filters.showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
        </Button>

        {filters.showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Select
              value={filters.operationType || ''}
              onChange={(e) => handleFilterChange('operationType', e.target.value || null)}
            >
              <option value="">Все операции</option>
              <option value="RECEIPT">Приход</option>
              <option value="ORDER_USE">Использование в заказе</option>
              <option value="WRITEOFF">Списание</option>
              <option value="RETURN">Возврат</option>
              <option value="ADJUSTMENT">Корректировка</option>
            </Select>

            <Input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              placeholder="Начальная дата"
            />

            <Input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              placeholder="Конечная дата"
            />

            <Input
              type="text"
              value={filters.flowerName}
              onChange={(e) => handleFilterChange('flowerName', e.target.value)}
              placeholder="Поиск по названию цветка"
              className="md:col-span-3"
            />
          </div>
        )}
      </div>

      {/* Список операций */}
      {loading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      ) : history.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="text-gray-500">История операций пуста</div>
        </div>
      ) : (
        <>
          <div className="flex-grow overflow-auto">
            {history.map((operation) => (
              <OperationCard key={operation.id} operation={operation} />
            ))}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Назад
              </Button>
              <span className="flex items-center px-4">
                Страница {currentPage} из {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Вперед
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HistoryMode;