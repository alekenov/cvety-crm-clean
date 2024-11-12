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
import PageLayout, { PageHeader, PageSection } from '../../components/layout/PageLayout/PageLayout';

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
      <div className="flex space-x-3">
        <button 
          className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          onClick={() => alert('Отправить отчет')}
        >
          <Share size={22} className="text-gray-600" />
        </button>
        <button 
          className="p-2.5 bg-green-500 text-white rounded-lg flex items-center hover:bg-green-600 transition-colors"
          onClick={() => setShowNewOperation(true)}
        >
          <Plus size={22} />
        </button>
      </div>
    </PageHeader>
  );

  // Модальное окно добавления операции
  const AddOperationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
        {/* Заголовок */}
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">
            {operationType === 'income' ? 'Новый доход' : 'Новый расход'}
          </h3>
          <button onClick={() => setShowNewOperation(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Переключатель типа */}
        <div className="flex rounded-lg bg-gray-100 p-1">
          <button
            className={`flex-1 py-2 rounded-lg transition-colors ${
              operationType === 'income' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setOperationType('income')}
          >
            Доход
          </button>
          <button
            className={`flex-1 py-2 rounded-lg transition-colors ${
              operationType === 'expense' 
                ? 'bg-red-500 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setOperationType('expense')}
          >
            Расход
          </button>
        </div>

        {/* Сумма */}
        <div>
          <label htmlFor="amount" className="block text-sm text-gray-600 mb-1">Сумма</label>
          <input
            id="amount"
            type="number"
            placeholder="0 ₸"
            className="w-full p-3 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Категория */}
        <div>
          <label htmlFor="category" className="block text-sm text-gray-600 mb-1">Категория</label>
          <div className="relative">
            <select 
              id="category"
              className="w-full p-3 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories[operationType].map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Описание */}
        <div>
          <label htmlFor="description" className="block text-sm text-gray-600 mb-1">Описание</label>
          <input
            id="description"
            type="text"
            placeholder="За что получили/потратили деньги"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Прикрепление файлов */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Прикрепить файл</label>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center p-3 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              <Camera size={24} className="mr-2" />
              Сделать фото
            </button>
            <button className="flex items-center justify-center p-3 border border-dashed rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
              <Upload size={24} className="mr-2" />
              Загрузить файл
            </button>
          </div>
        </div>

        {/* Кнопка сохранения */}
        <button className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
          operationType === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
        }`}>
          Сохранить
        </button>
      </div>
    </div>
  );

  return (
    <PageLayout header={header}>
      <div className="space-y-6">
        {/* Основная информация */}
        <PageSection>
          <div className="flex flex-wrap gap-2 mb-6">
            {['Сегодня', 'Неделя', 'Месяц', 'Квартал', 'Год'].map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedPeriod === tab.toLowerCase() 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedPeriod(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
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
            <div className="flex items-center gap-4">
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <Calendar size={16} />
                Фильтр по дате
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
                <Trash size={16} />
                Очистить
              </button>
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
              <div className="flex flex-wrap gap-2">
                <button 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    filterType === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setFilterType('all')}
                >
                  Все
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    filterType === 'income' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setFilterType('income')}
                >
                  Доходы
                </button>
                <button 
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    filterType === 'expense' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setFilterType('expense')}
                >
                  Расходы
                </button>
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