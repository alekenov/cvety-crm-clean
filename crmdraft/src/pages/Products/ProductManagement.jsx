import React, { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import PageLayout, { PageHeader, PageSection } from '../../components/layout/PageLayout/PageLayout';

function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  // Компонент поиска, который можно переиспользовать
  const SearchInput = ({ value, onChange, placeholder }) => (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2 border rounded-lg w-64"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
    </div>
  );

  // Верхняя панель страницы
  const header = (
    <PageHeader title="Мои букеты">
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Поиск букетов..."
      />
      <button className="p-2 bg-gray-100 rounded-lg">
        <Filter size={20} />
      </button>
      <button className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center">
        <Plus size={20} className="mr-2" />
        Добавить букет
      </button>
    </PageHeader>
  );

  return (
    <PageLayout
      header={header}
      className="space-y-6"
    >
      <PageSection>
        {/* Таблица товаров */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium">
          <div className="col-span-5">Название</div>
          <div className="col-span-2">Варианты</div>
          <div className="col-span-2 text-right">Цена</div>
          <div className="col-span-3 text-right">Действия</div>
        </div>
        {/* ... остальной код таблицы ... */}
      </PageSection>
    </PageLayout>
  );
}

export default ProductManagement;