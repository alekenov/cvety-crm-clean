import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Phone, MessageSquare } from 'lucide-react';
import { clientsService } from '@/services/clientsService';
import { Button } from '@/components/ui/button';
import { ClientTags } from '@/components/ClientTags/ClientTags';
import ClientStats from './components/ClientStats';
import OrderHistory from './components/OrderHistory';
import ClientAnalytics from './components/ClientAnalytics';
import { format } from 'date-fns';

function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientData, setClientData] = useState(null);

  // Загрузка данных клиента
  useEffect(() => {
    const loadClientProfile = async () => {
      try {
        setLoading(true);
        const profile = await clientsService.getClientProfile(Number(id));
        setClientData(profile);
        setError(null);
      } catch (err) {
        setError('Ошибка при загрузке профиля клиента');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadClientProfile();
  }, [id]);

  // Обработчик добавления комментария
  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        await clientsService.addClientNote(Number(id), {
          text: comment,
          category: 'general'
        });
        
        // Перезагружаем данные клиента
        const updatedProfile = await clientsService.getClientProfile(Number(id));
        setClientData(updatedProfile);
        
        setComment('');
        setShowCommentInput(false);
      } catch (err) {
        console.error('Error adding comment:', err);
        // TODO: Добавить уведомление об ошибке
      }
    }
  };

  // Обработчик обновления тегов
  const handleUpdateTags = async (tags) => {
    try {
      setLoading(true);
      await clientsService.updateClientTags(Number(id), tags);
      // Обновляем данные клиента после изменения тегов
      const updatedProfile = await clientsService.getClientProfile(Number(id));
      setClientData(updatedProfile);
    } catch (err) {
      console.error('Error updating tags:', err);
      // TODO: Добавить уведомление об ошибке
    } finally {
      setLoading(false);
    }
  };

  // Обработчики для тегов
  const handleAddTag = async (tag) => {
    if (clientData.tags) {
      await handleUpdateTags([...clientData.tags, tag]);
    }
  };

  const handleRemoveTag = async (tag) => {
    if (clientData.tags) {
      await handleUpdateTags(clientData.tags.filter(t => t !== tag));
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !clientData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error || 'Клиент не найден'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Шапка */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/clients')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{clientData.name}</h1>
            <p className="text-gray-500">
              Клиент с {format(new Date(clientData.joinDate), 'dd.MM.yyyy')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.location.href = `tel:${clientData.phone}`}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => window.location.href = `https://wa.me/${clientData.contacts.whatsapp}`}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка */}
        <div className="space-y-6">
          {/* Основная информация */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Основная информация</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Имя</p>
                <p className="font-medium">{clientData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Телефон</p>
                <p className="font-medium">{clientData.phone}</p>
              </div>
              {clientData.contacts.additionalPhone && (
                <div>
                  <p className="text-sm text-gray-500">Дополнительный телефон</p>
                  <p className="font-medium">{clientData.contacts.additionalPhone}</p>
                </div>
              )}
              {clientData.contacts.whatsapp && (
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium">{clientData.contacts.whatsapp}</p>
                </div>
              )}
              {clientData.contacts.instagram && (
                <div>
                  <p className="text-sm text-gray-500">Instagram</p>
                  <p className="font-medium">{clientData.contacts.instagram}</p>
                </div>
              )}
              {clientData.contacts.address && (
                <div>
                  <p className="text-sm text-gray-500">Адрес</p>
                  <p className="font-medium">{clientData.contacts.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Теги */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Теги</h2>
            </div>
            <ClientTags
              tags={clientData.tags || []}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              editable={isEditing}
            />
          </div>

          {/* Предпочтения */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Предпочтения</h2>
            <div className="space-y-3">
              {clientData.preferences.favoriteFlowers.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Любимые цветы</p>
                  <p className="font-medium">{clientData.preferences.favoriteFlowers.join(', ')}</p>
                </div>
              )}
              {clientData.preferences.allergies.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Аллергии</p>
                  <p className="font-medium text-red-600">{clientData.preferences.allergies.join(', ')}</p>
                </div>
              )}
              {clientData.preferences.preferredColors.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Предпочитаемые цвета</p>
                  <p className="font-medium">{clientData.preferences.preferredColors.join(', ')}</p>
                </div>
              )}
              {clientData.preferences.preferredDeliveryTime && (
                <div>
                  <p className="text-sm text-gray-500">Предпочитаемое время доставки</p>
                  <p className="font-medium">{clientData.preferences.preferredDeliveryTime}</p>
                </div>
              )}
            </div>
          </div>

          {/* Важные даты */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Важные даты</h2>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {/* TODO: Добавить диалог добавления даты */}}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {clientData.importantDates.map((date, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{date.occasion}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(date.date), 'dd.MM.yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Центральная колонка */}
        <div className="space-y-6 md:col-span-2">
          {/* Статистика */}
          <ClientStats client={clientData} />

          {/* История заказов */}
          <OrderHistory clientId={id} />

          {/* Аналитика */}
          <ClientAnalytics clientId={id} />

          {/* Заметки */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Заметки</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCommentInput(!showCommentInput)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {showCommentInput && (
              <div className="mb-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Добавить заметку..."
                  rows="3"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setComment('');
                      setShowCommentInput(false);
                    }}
                  >
                    Отмена
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {clientData.notes.map((note) => (
                <div key={note.id} className="border-b pb-2">
                  <p className="text-sm">{note.text}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">{note.author}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(note.date), 'dd.MM.yyyy')}
                    </p>
                  </div>
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
