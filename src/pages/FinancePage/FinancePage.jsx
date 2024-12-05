import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  ArrowUp, 
  ArrowDown,
  Search,
  FileText,
  Download,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout, { PageHeader, PageSection } from '@/components/layout/PageLayout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import toast from 'react-hot-toast';
import FinancePeriodFilter from '@/components/Filters/FinancePeriodFilter';
import FinanceTypeFilter from '@/components/Filters/FinanceTypeFilter';
import FinanceCategoryFilter from '@/components/Filters/FinanceCategoryFilter';
import NewOperationModal from './components/NewOperationModal';
import { operationsService } from '@/services/operations/operationsService';

const FinancePage = () => {
  // Состояния для фильтров
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [customDate, setCustomDate] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Состояния для операций
  const [showNewOperation, setShowNewOperation] = useState(false);
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка операций
  useEffect(() => {
    const loadOperations = async () => {
      try {
        setLoading(true);
        const data = await operationsService.getOperations();
        setOperations(data);
      } catch (error) {
        toast.error('Ошибка при загрузке операций');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadOperations();
  }, []);

  // Отфильтрованные операции
  const filteredOperations = useMemo(() => {
    return operations.filter(operation => {
      const matchesSearch = operation.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || operation.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || operation.category === selectedCategory;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [operations, searchTerm, selectedType, selectedCategory]);

  // Расчет статистики на основе отфильтрованных операций
  const statistics = useMemo(() => {
    const income = filteredOperations
      .filter(op => op.type === 'income')
      .reduce((sum, op) => sum + Number(op.amount), 0);
    
    const expenses = filteredOperations
      .filter(op => op.type === 'expense')
      .reduce((sum, op) => sum + Number(op.amount), 0);
    
    return {
      income,
      expenses,
      profit: income - expenses
    };
  }, [filteredOperations]);

  const handleSaveOperation = async (newOperation) => {
    try {
      const savedOperation = await operationsService.createOperation(newOperation);
      setOperations(prev => [savedOperation, ...prev]);
      toast.success('Операция успешно добавлена');
    } catch (error) {
      toast.error('Ошибка при сохранении операции');
      console.error(error);
    }
  };

  return (
    <PageLayout>
      <PageHeader title="Финансы">
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowNewOperation(true)}
            variant="primary"
          >
            <Plus className="w-5 h-5 mr-2" />
            Новая операция
          </Button>
          <Button variant="outline">
            <FileText className="w-5 h-5 mr-2" />
            Отчет
          </Button>
        </div>
      </PageHeader>
      
      <PageSection>
        <div className="space-y-6">
          {/* Строка поиска */}
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по операциям..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Фильтры */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FinancePeriodFilter
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              customDate={customDate}
              onCustomDateChange={setCustomDate}
            />
            <FinanceTypeFilter
              selectedType={selectedType}
              onTypeChange={setSelectedType}
            />
            <FinanceCategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              operationType={selectedType}
            />
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 flex items-center">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                Доходы
              </span>
              <span className="text-2xl font-bold text-green-500">
                {statistics.income.toLocaleString()} ₸
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 flex items-center">
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                Расходы
              </span>
              <span className="text-2xl font-bold text-red-500">
                {statistics.expenses.toLocaleString()} ₸
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">Прибыль</span>
              <span className="text-2xl font-bold text-blue-500">
                {statistics.profit.toLocaleString()} ₸
              </span>
            </div>
          </div>

          {/* Список операций */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Загрузка операций...
              </div>
            ) : filteredOperations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Нет операций для отображения
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Дата
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Тип
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Категория
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Описание
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Связанный заказ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Сумма
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOperations.map((operation) => (
                      <tr key={operation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(operation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            operation.type === 'income' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {operation.type === 'income' ? 'Доход' : 'Расход'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {operation.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {operation.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {operation.order && (
                            <Link 
                              to={`/orders/${operation.order.id}`}
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <span className="mr-1">
                                {operation.order.client_name} ({operation.order.status})
                              </span>
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          <span className={operation.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                            {Number(operation.amount).toLocaleString()} ₸
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </PageSection>

      <NewOperationModal
        isOpen={showNewOperation}
        onClose={() => setShowNewOperation(false)}
        onSave={handleSaveOperation}
      />
    </PageLayout>
  );
};

export default FinancePage;