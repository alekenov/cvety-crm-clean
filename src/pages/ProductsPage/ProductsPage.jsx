import React, { useState } from 'react';
import PageLayout, { PageHeader } from '../../components/layout/PageLayout/PageLayout';
import Button from '../../components/ui/Button/Button';
import ProductForm from './components/ProductForm';
import ProductEditForm from './components/ProductEditForm';
import { Plus, Search, Filter } from 'lucide-react';
import styles from './ProductsPage.module.css';

function ProductsPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const header = (
    <PageHeader title="Мои букеты">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск букетов"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <Button variant="secondary" icon={<Filter size={20} />} />
        <Button 
          variant="primary" 
          icon={<Plus size={20} />}
          onClick={() => setShowAddForm(true)}
        >
          Новый букет
        </Button>
      </div>
    </PageHeader>
  );

  return (
    <PageLayout header={header}>
      <div className={styles.productsList}>
        {/* Здесь будет список букетов */}
      </div>

      {showAddForm && (
        <ProductForm onClose={() => setShowAddForm(false)} />
      )}
    </PageLayout>
  );
}

export default ProductsPage; 