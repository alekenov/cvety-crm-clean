import React, { useState } from 'react';
import { Search, MessageCircle, Phone, Plus, ShoppingBag, Star, ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';

// Мобильная карточка клиента
const MobileClientCard = ({ client }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="font-semibold">{client.name}</h3>
            {client.isVip && (
              <Star size={16} className="ml-1 text-yellow-400 fill-yellow-400" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{client.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{client.totalOrders} заказов</p>
          <p className="text-sm font-medium">{client.totalSpent.toLocaleString()} ₸</p>
        </div>
      </div>

      {client.tags && client.tags.length > 0 && (
        <div className="mt-3">
          {client.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-100 text-xs text-gray-600 px-2 py-1 rounded-full mr-2 mb-1"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-3">
        <button
          onClick={() => window.location.href = `tel:${client.phone}`}
          className="flex items-center justify-center py-2 px-4 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex-1 mr-2"
        >
          <Phone size={16} className="mr-1" />
          Позвонить
        </button>
        <button
          onClick={() => window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`)}
          className="flex items-center justify-center py-2 px-4 bg-green-50 text-green-600 rounded-lg text-sm font-medium flex-1"
        >
          <MessageCircle size={16} className="mr-1" />
          WhatsApp
        </button>
      </div>
    </div>
  );
};

// Десктопная строка клиента
const DesktopClientRow = ({ client }) => {
  return (
    <div className="bg-white hover:bg-gray-50 p-4 border-b border-gray-100 flex items-center">
      <div className="w-1/4">
        <div className="flex items-center">
          <div className="font-medium">{client.name}</div>
          {client.isVip && <Star size={16} className="ml-1 text-yellow-400 fill-yellow-400" />}
        </div>
        <div className="text-sm text-gray-500">{client.phone}</div>
      </div>

      <div className="w-1/4 text-sm">
        <div>Всего заказов: {client.totalOrders}</div>
        <div className="text-green-600">Сумма: {client.totalSpent.toLocaleString()} ₸</div>
      </div>

      <div className="w-1/4 flex flex-wrap gap-1">
        {client.tags?.map((tag, index) => (
          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="w-1/4 flex justify-end space-x-2">
        <button 
          onClick={() => window.location.href = `tel:${client.phone}`}
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          title="Позвонить"
        >
          <Phone size={20} />
        </button>
        <button
          onClick={() => window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`)}
          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
          title="WhatsApp"
        >
          <MessageCircle size={20} />
        </button>
        <button
          onClick={() => alert('Создание заказа')}
          className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
          title="Создать заказ"
        >
          <ShoppingBag size={20} />
        </button>
      </div>
    </div>
  );
};

function ClientsPage() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const clients = useSelector(state => state.clients.items);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  // Мобильная версия
  const MobileView = () => (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen sm:hidden">
      <div className="bg-white p-4 flex items-center justify-between shadow-sm">
        {showForm ? (
          <>
            <button onClick={() => setShowForm(false)} className="mr-2">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-lg font-semibold">Новый клиент</h1>
          </>
        ) : (
          <>
            <h1 className="text-lg font-semibold">Мои клиенты</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <Search size={20} />
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
              >
                +
              </button>
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        {showSearch && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск по имени или телефону"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 pr-4 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredClients.map(client => (
            <MobileClientCard key={client.id} client={client} />
          ))}
        </div>
      </div>
    </div>
  );

  // Десктопная версия
  const DesktopView = () => (
    <div className="hidden sm:block min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Мои клиенты</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Поиск клиента..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
              />
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <Plus size={20} className="mr-2" />
              Добавить клиента
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center font-medium text-gray-500">
            <div className="w-1/4">Клиент</div>
            <div className="w-1/4">Статистика</div>
            <div className="w-1/4">Заметки</div>
            <div className="w-1/4 text-right">Действия</div>
          </div>

          {filteredClients.map(client => (
            <DesktopClientRow key={client.id} client={client} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}

export default ClientsPage;