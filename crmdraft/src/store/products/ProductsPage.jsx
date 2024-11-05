import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Package, Search, Plus } from 'lucide-react';

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const products = useSelector(state => state.products.items);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><Package size={24} /> Товары</h1>
        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="add-button">
            <Plus size={20} />
            Добавить товар
          </button>
        </div>
      </div>

      <div className="products-list">
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Цена</th>
              <th>Количество</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.quantity}</td>
                <td className="actions">
                  <button className="edit-btn">Редактировать</button>
                  <button className="delete-btn">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsPage; 