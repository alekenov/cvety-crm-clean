import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Users, Search, Plus } from 'lucide-react';
import './ClientsPage.css';

function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const clients = useSelector(state => state.clients.items);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="clients-page">
      <div className="clients-header">
        <h1><Users size={24} /> Клиенты</h1>
        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Поиск клиентов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-client-btn">
          <Plus size={20} />
          Добавить клиента
        </button>
      </div>

      <div className="clients-grid">
        {filteredClients.map(client => (
          <div key={client.id} className="client-card">
            <div className="client-info">
              <h3>{client.name}</h3>
              <p>{client.phone}</p>
              <p>{client.email}</p>
            </div>
            <div className="client-actions">
              <button className="edit-btn">Редактировать</button>
              <button className="delete-btn">Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientsPage; 