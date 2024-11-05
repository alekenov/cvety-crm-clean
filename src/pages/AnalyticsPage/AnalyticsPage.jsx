import React, { useState } from 'react';
import PageLayout, { PageHeader, PageSection } from '../../components/layout/PageLayout/PageLayout';
import { BarChart, PieChart, TrendingUp, Calendar, Download, Filter } from 'lucide-react';
import Button from '../../components/ui/Button/Button';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('month');
  
  const stats = {
    sales: {
      total: 1250000,
      growth: 12.5,
      chart: [] // Данные для графика
    },
    products: {
      top: [
        { name: 'Букет "Нежность"', sales: 45, revenue: 450000 },
        { name: 'Розы красные', sales: 38, revenue: 380000 },
        { name: 'Букет "Весенний"', sales: 32, revenue: 320000 }
      ],
      categories: [
        { name: 'Букеты', percentage: 45 },
        { name: 'Розы', percentage: 30 },
        { name: 'Композиции', percentage: 15 },
        { name: 'Другое', percentage: 10 }
      ]
    },
    clients: {
      new: 85,
      returning: 120,
      average: 15000
    }
  };

  const header = (
    <PageHeader title="Аналитика">
      <div className="flex items-center space-x-3">
        <div className="flex rounded-lg border overflow-hidden">
          <button 
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 ${period === 'week' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Неделя
          </button>
          <button 
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 ${period === 'month' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Месяц
          </button>
          <button 
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 ${period === 'year' ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            Год
          </button>
        </div>
        <Button variant="secondary" icon={<Calendar size={20} />} />
        <Button variant="secondary" icon={<Download size={20} />}>
          Экспорт
        </Button>
      </div>
    </PageHeader>
  );

  return (
    <PageLayout header={header}>
      {/* Основные показатели */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">Продажи</div>
          <div className="text-2xl font-bold">
            {stats.sales.total.toLocaleString()} ₸
          </div>
          <div className="text-sm text-green-600 mt-1">
            +{stats.sales.growth}% к прошлому периоду
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">Средний чек</div>
          <div className="text-2xl font-bold">
            {stats.clients.average.toLocaleString()} ₸
          </div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">Новых клиентов</div>
          <div className="text-2xl font-bold">{stats.clients.new}</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">Повторных клиентов</div>
          <div className="text-2xl font-bold">{stats.clients.returning}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* График продаж */}
        <div className="col-span-2">
          <PageSection 
            title="Динамика продаж" 
            actions={
              <Button variant="secondary" icon={<Filter size={16} />} size="sm">
                Фильтры
              </Button>
            }
          >
            <div className="bg-white p-4 rounded-lg">
              {/* График продаж */}
              <div className="h-80 flex items-center justify-center text-gray-400">
                График продаж
              </div>
            </div>
          </PageSection>
        </div>

        {/* Категории товаров */}
        <PageSection title="Категории">
          <div className="bg-white p-4 rounded-lg">
            {stats.products.categories.map(category => (
              <div key={category.name} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm mb-1">
                  <span>{category.name}</span>
                  <span>{category.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div 
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </PageSection>

        {/* Популярные товары */}
        <div className="col-span-2">
          <PageSection title="Популярные товары">
            <div className="bg-white rounded-lg">
              <div className="grid grid-cols-4 gap-4 p-4 border-b bg-gray-50 text-sm text-gray-600">
                <div>Наименование</div>
                <div className="text-right">Продажи</div>
                <div className="text-right">Выручка</div>
                <div className="text-right">Доля</div>
              </div>
              {stats.products.top.map(product => (
                <div key={product.name} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0">
                  <div className="font-medium">{product.name}</div>
                  <div className="text-right">{product.sales} шт</div>
                  <div className="text-right">
                    {product.revenue.toLocaleString()} ₸
                  </div>
                  <div className="text-right text-gray-600">
                    {Math.round((product.revenue / stats.sales.total) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </PageSection>
        </div>

        {/* График клиентов */}
        <PageSection title="Клиенты">
          <div className="bg-white p-4 rounded-lg">
            {/* График клиентов */}
            <div className="h-80 flex items-center justify-center text-gray-400">
              График клиентов
            </div>
          </div>
        </PageSection>
      </div>
    </PageLayout>
  );
} 