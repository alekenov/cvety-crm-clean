import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil } from 'lucide-react';
import ClientStats from './components/ClientStats';
import OrderHistory from './components/OrderHistory';
import ClientAnalytics from './components/ClientAnalytics';
import ClientReviews from './components/ClientReviews';

function ClientProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');

  // Демонстрационные данные клиента
  const clientData = {
    id: 1,
    name: "Анна Смирнова",
    phone: "+7 (777) 123-45-67",
    joinDate: "2023-01-15",
    totalOrders: 5,
    totalSpent: 125000,
    averageOrder: 25000,
    tags: ['Постоянный', 'Предпочитает розы']
  };

  const [comments, setComments] = useState([
    {
      id: 1,
      text: "Предпочитает розовые розы",
      date: "2024-01-15"
    },
    {
      id: 2,
      text: "Всегда заказывает на особые случаи",
      date: "2024-01-10"
    }
  ]);

  const handleAddComment = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          text: comment,
          date: new Date().toISOString()
        }
      ]);
      setComment('');
      setShowCommentInput(false);
    }
  };

  return (
    <div className="p-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/clients')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{clientData.name}</h1>
            <p className="text-sm text-gray-500">
              Клиент с {new Date(clientData.joinDate).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Pencil className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          <ClientStats client={clientData} />
          <OrderHistory clientId={clientData.id} />
          <ClientAnalytics clientId={clientData.id} />
          <ClientReviews />
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Контактная информация */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Контактная информация</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Телефон</p>
                <p className="font-medium">{clientData.phone}</p>
              </div>
            </div>
          </div>

          {/* Комментарии */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Комментарии</h2>
              {!showCommentInput && (
                <button
                  onClick={() => setShowCommentInput(true)}
                  className="text-blue-600 hover:text-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить комментарий
                </button>
              )}
            </div>

            {showCommentInput && (
              <div className="mb-4 bg-blue-50 p-4 rounded-lg">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border rounded-lg mb-3"
                  placeholder="Введите комментарий..."
                  rows="3"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowCommentInput(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Добавить
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(comment.date).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;
