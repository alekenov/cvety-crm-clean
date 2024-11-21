import React, { useState } from 'react';
import { 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Calendar, 
  Receipt,
  Share,
  Trash,
  Camera,
  X,
  ChevronDown,
  FileText,
  Upload,
  Search
} from 'lucide-react';
import PageLayout, { PageHeader, PageSection } from '@/components/layout/PageLayout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

const FinancePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [showNewOperation, setShowNewOperation] = useState(false);
  const [operationType, setOperationType] = useState('income');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Категории для выбора
  const categories = {
    income: [
      { id: 'cash', name: 'Наличные' },
      { id: 'card', name: 'Карта' },
      { id: 'marketplace', name: 'Cvety.kz' }
    ],
    expense: [
      { id: 'flowers', name: 'Закуп цветов' },
      { id: 'delivery', name: 'Доставка' },
      { id: 'package', name: 'Упаковка' },
      { id: 'other', name: 'Прочее' }
    ]
  };

  // Демо-данные
  const data = {
    summary: {
      income: 115000,
      expenses: 70000,
      profit: 45000
    },
    operations: [
      {
        id: 1,
        time: "10:30",
        type: "income",
        amount: 15000,
        description: "Букет 'Нежность'",
        payment: "Карта",
        orderId: "#1234",
        hasFiles: true
      },
      {
        id: 2,
        time: "11:15",
        type: "expense",
        amount: 8000,
        description: "Закуп роз (50 шт)",
        category: "Закуп цветов",
        hasFiles: true
      },
      {
        id: 3,
        time: "13:20",
        type: "income",
        amount: 12000,
        description: "Букет '15 роз'",
        payment: "Наличные",
        orderId: "#1235",
        hasFiles: false
      }
    ]
  };

  const header = (
    <PageHeader title="Финансы">
      <div className="flex space-x-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowNewOperation(true)}
        >
          <Plus size={16} className="mr-1" />
          Новая операция
        </Button>
        <Button
          variant="outline"
          size="sm"
        >
          <FileText size={16} className="mr-1" />
          Отчет
        </Button>
      </div>
    </PageHeader>
  );

  // Модальное окно добавления операции
  const AddOperationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Новая операция</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewOperation(false)}
          >
            <X size={20} />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex space-x-2">
            <Button
              variant={operationType === 'income' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setOperationType('income')}
            >
              <ArrowUp size={16} className="mr-1" />
              Приход
            </Button>
            <Button
              variant={operationType === 'expense' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setOperationType('expense')}
            >
              <ArrowDown size={16} className="mr-1" />
              Расход
            </Button>
          </div>

          <Input
            type="text"
            placeholder="Сумма"
            className="w-full"
          />

          <div className="grid grid-cols-2 gap-2">
            {categories[operationType].map(category => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>

          <Input
            type="text"
            placeholder="Комментарий"
            className="w-full"
          />

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
            >
              <Camera size={16} className="mr-1" />
              Фото чека
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Upload size={16} className="mr-1" />
              Загрузить чек
            </Button>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewOperation(false)}
          >
            Отмена
          </Button>
          <Button
            variant="primary"
            size="sm"
          >
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <PageLayout header={header}>
      <div className="space-y-6">
        {/* Основная информация */}
        <PageSection>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPeriod('today')}
              className={selectedPeriod === 'today' ? 'bg-primary text-white' : ''}
            >
              Сегодня
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPeriod('week')}
              className={selectedPeriod === 'week' ? 'bg-primary text-white' : ''}
            >
              Неделя
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPeriod('month')}
              className={selectedPeriod === 'month' ? 'bg-primary text-white' : ''}
            >
              Месяц
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Calendar size={16} className="mr-1" />
              Выбрать
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <ArrowUp className="text-green-500 w-5 h-5" />
                <span className="text-sm text-gray-500 ml-2">Доходы</span>
              </div>
              <p className="text-2xl font-bold text-green-500">
                {data.summary.income.toLocaleString()} ₸
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <ArrowDown className="text-red-500 w-5 h-5" />
                <span className="text-sm text-gray-500 ml-2">Расходы</span>
              </div>
              <p className="text-2xl font-bold text-red-500">
                {data.summary.expenses.toLocaleString()} ₸
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <span className="text-sm text-gray-500">Прибыль</span>
              </div>
              <p className="text-2xl font-bold text-blue-500">
                {data.summary.profit.toLocaleString()} ₸
              </p>
            </div>
          </div>
        </PageSection>

        {/* История операций */}
        <PageSection
          title="История операций"
          actions={
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
              >
                <Calendar size={16} className="mr-1" />
                Фильтр по дате
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Trash size={16} />
                Очистить
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Поиск и фильтры */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск операций..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterType('all')}
                  className={filterType === 'all' ? 'bg-primary text-white' : ''}
                >
                  Все
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterType('income')}
                  className={filterType === 'income' ? 'bg-primary text-white' : ''}
                >
                  <ArrowUp size={16} className="mr-1" />
                  Приход
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterType('expense')}
                  className={filterType === 'expense' ? 'bg-primary text-white' : ''}
                >
                  <ArrowDown size={16} className="mr-1" />
                  Расход
                </Button>
              </div>
            </div>

            {/* Список операций */}
            {data.operations.map(operation => (
              <div key={operation.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{operation.description}</p>
                    <p className="text-sm text-gray-500">
                      {operation.time}
                      {operation.orderId && ` • ${operation.orderId}`}
                      {operation.payment && ` • ${operation.payment}`}
                    </p>
                    {operation.hasFiles && (
                      <div className="flex items-center mt-1 text-blue-500">
                        <FileText size={16} className="mr-1" />
                        <span className="text-sm">Файлы</span>
                      </div>
                    )}
                  </div>
                  <span className={`font-bold ${
                    operation.type === 'income' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {operation.type === 'income' ? '+' : '-'}{operation.amount.toLocaleString()} ₸
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      </div>

      {/* Модальное окно добавления */}
      {showNewOperation && <AddOperationModal />}
    </PageLayout>
  );
};

export default FinancePage;