import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Camera, Truck, AlertTriangle, MapPin, Phone, 
  User, Store, Clock, Upload, ThumbsUp, ThumbsDown, RefreshCw,
  Search, Filter, Plus, ChevronDown, ChevronRight, ArrowLeft,
  Gift, CreditCard, ShoppingBag
} from 'lucide-react';
import PageLayout, { PageHeader, PageSection } from '../../components/layout/PageLayout/PageLayout';
import Button from '../../components/ui/Button/Button';
import Card from '../../components/ui/Card/Card';
import { useNavigate, useLocation } from 'react-router-dom';
import Badge from '../../components/ui/Badge/Badge';
import { OrdersSkeleton } from '../../components/ui/Skeleton/Skeleton';
import { supabase } from '../../lib/supabase';

const OrderCard = ({ order, onUploadPhoto, onRespondToClientReaction, onClick }) => {
  const statusColors = {
    'Не оплачен': 'danger',
    'Оплачен': 'primary',
    'В работе': 'warning',
    'Собран': 'info',
    'Ожидает курьера': 'warning',
    'В пути': 'info',
    'Доставлен': 'success',
    'Проблема с доставкой': 'danger'
  };

  const handlePhotoUpload = () => {
    onUploadPhoto(order.number);
  };

  const handleClientReaction = (reaction) => {
    onRespondToClientReaction(order.number, reaction);
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow-sm mb-4 cursor-pointer"
      onClick={() => onClick(order.number)}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-bold text-lg">{order.number}</span>
        <span className="font-semibold text-green-600">{order.totalPrice}</span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 flex items-center">
            <Clock size={16} className="mr-1" />
            {order.time}
          </span>
          <Badge variant={statusColors[order.status]}>
            {order.status}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="flex items-center text-gray-600">
            <Phone size={16} className="mr-1" />
            {order.client}
          </p>
          <p className="flex items-center text-gray-600">
            <MapPin size={16} className="mr-1" />
            {order.address}
          </p>
        </div>

        {order.shop && (
          <div className="bg-gray-50 p-2 rounded-lg">
            <p className="flex items-center text-gray-700">
              <Store size={16} className="mr-1" />
              Магазин: {order.shop}
            </p>
            {order.florist && order.status !== 'Оплачен' && (
              <p className="flex items-center text-gray-700 mt-1">
                <User size={16} className="mr-1" />
                Флорист: {order.florist}
              </p>
            )}
          </div>
        )}

        <div>
          <h4 className="font-medium mb-2">Состав заказа:</h4>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center">
                  <img 
                    src={item.image} 
                    alt={item.description} 
                    className="w-12 h-12 object-cover rounded-md mr-2"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg'; // Fallback изображение
                    }}
                  />
                  <span className="text-sm">{item.description}</span>
                </div>
                <span className="font-medium">{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {order.clientComment && (
          <div className="bg-yellow-50 p-2 rounded-lg">
            <h4 className="font-medium mb-1 flex items-center">
              <MessageCircle size={16} className="mr-1 text-yellow-500" />
              Комментари клиента:
            </h4>
            <p className="text-sm">{order.clientComment}</p>
          </div>
        )}

        {order.clientReaction && (
          <div className={`p-2 rounded-lg ${
            order.clientReaction === 'positive' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <h4 className="font-medium mb-1 flex items-center">
              {order.clientReaction === 'positive' ? (
                <ThumbsUp size={16} className="mr-1 text-green-500" />
              ) : (
                <ThumbsDown size={16} className="mr-1 text-red-500" />
              )}
              Реакция клиента:
            </h4>
            <p className="text-sm">{order.clientReactionComment}</p>
            {order.clientReaction === 'negative' && !order.reassemblyRequested && (
              <button 
                onClick={() => handleClientReaction('reassemble')}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm flex items-center"
              >
                <RefreshCw size={14} className="mr-1" />
                Пересобрать букет
              </button>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            icon={<Phone size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `tel:${order.client}`;
            }}
          >
            Позвонить
          </Button>
          <Button
            variant="secondary"
            icon={<MessageCircle size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://wa.me/${order.client.replace(/[^0-9]/g, '')}`);
            }}
          >
            WhatsApp
          </Button>
          {(order.status === 'Оплачен' || order.status === 'В работе') && (
            <Button
              variant="primary"
              icon={<Upload size={16} />}
              onClick={handlePhotoUpload}
            >
              Загрузить фото
            </Button>
          )}
        </div>

        {order.deliveryProblem && (
          <div className="bg-red-50 p-2 rounded-lg">
            <h4 className="font-medium mb-1 flex items-center text-red-700">
              <AlertTriangle size={16} className="mr-1" />
              Проблема с доставкой:
            </h4>
            <p className="text-sm text-red-700">{order.deliveryProblem}</p>
          </div>
        )}
      </div>
    </div>
  );
};

function OrdersPage() {
  const [expandedGroups, setExpandedGroups] = useState(['today', 'tomorrow']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [orders, setOrders] = useState({
    today: [],
    tomorrow: [],
    later: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Загрузка заказов
  useEffect(() => {
    loadOrders();
  }, []);

  // Добавляем эффект для отслеживания изменения location
  useEffect(() => {
    if (location.state?.refresh) {
      loadOrders();
    }
  }, [location]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Загружаем заказы с упрощенным запросом
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Ошибка при загрузке заказов:', error);
        throw error;
      }

      console.log('Загруженные заказы:', data);

      if (!data || data.length === 0) {
        console.log('Нет заказов в базе данных');
        setOrders({ today: [], tomorrow: [], later: [] });
        return;
      }

      // Группируем заказы по датам
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const grouped = {
        today: [],
        tomorrow: [],
        later: []
      };

      data.forEach(order => {
        console.log('Обработка заказа:', order);

        const orderDate = order.delivery_date ? new Date(order.delivery_date) : new Date();
        orderDate.setHours(0, 0, 0, 0);

        const formattedOrder = {
          id: order.id,
          number: order.number,
          status: order.status || 'Не оплачен',
          client: order.client_phone,
          address: order.address,
          time: order.delivery_time || 'Не указано',
          totalPrice: `${parseFloat(order.total_price || 0).toLocaleString()} ₸`,
          items: order.order_items?.map(item => ({
            description: 'Товар',
            price: `${parseFloat(item.price || 0).toLocaleString()} ₸`,
            image: '/placeholder.jpg'
          })) || [],
          clientComment: order.client_comment
        };

        if (orderDate.getTime() === today.getTime()) {
          grouped.today.push(formattedOrder);
        } else if (orderDate.getTime() === tomorrow.getTime()) {
          grouped.tomorrow.push(formattedOrder);
        } else if (orderDate > today) {
          grouped.later.push(formattedOrder);
        } else {
          grouped.today.push(formattedOrder);
        }
      });

      console.log('Итоговая группировка:', grouped);
      setOrders(grouped);
      
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Обработчики действий
  const handleUploadPhoto = async (orderNumber) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'photo_uploaded' })
        .eq('number', orderNumber.replace('№', ''));

      if (error) throw error;
      
      await loadOrders(); // Перезагружаем заказы
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleRespondToClientReaction = async (orderNumber, reaction) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: reaction === 'reassemble' ? 'reassembly_requested' : 'completed',
          reassembly_requested: reaction === 'reassemble'
        })
        .eq('number', orderNumber.replace('№', ''));

      if (error) throw error;
      
      await loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleCreateOrder = () => {
    navigate('/order/create');
  };

  const statusColors = {
    'Новый': 'danger',
    'В работе': 'warning',
    'Собран': 'info',
    'Ожидает курьера': 'warning',
    'В пути': 'info',
    'Доставлен': 'success',
    'Проблема с доставкой': 'danger'
  };

  const groupTitles = {
    today: 'Сегодня',
    tomorrow: 'Завтра',
    later: 'Будущие заказы'
  };

  const toggleGroup = (group) => {
    setExpandedGroups(prev => 
      prev.includes(group) 
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  };

  const handleOrderClick = (orderNumber) => {
    const cleanNumber = orderNumber.replace('№', '');
    navigate(`/order/${cleanNumber}`);
  };

  // Верхняя панель
  const header = (
    <PageHeader title="Заказы">
      <div className="flex items-center space-x-3">
        <Button 
          variant="primary" 
          icon={<Plus size={20} />}
          onClick={handleCreateOrder}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Новый заказ
        </Button>
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск заказов"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-64"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <Button variant="secondary" icon={<Filter size={20} />} />
      </div>
    </PageHeader>
  );

  // Мобильная версия
  const MobileView = () => (
    <div className="sm:hidden">
      <div className="bg-white p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold">Заазы</h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="primary"
              onClick={handleCreateOrder}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={20} className="mr-2" />
              Новый заказ
            </Button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск заказов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="p-4 pb-24">
        {Object.entries(orders).map(([group, groupOrders]) => (
          <div key={group} className="mb-6">
            <div 
              className="flex items-center bg-white p-3 rounded-lg shadow-sm mb-4 cursor-pointer"
              onClick={() => toggleGroup(group)}
            >
              {expandedGroups.includes(group) ? (
                <ChevronDown size={20} className="mr-2" />
              ) : (
                <ChevronRight size={20} className="mr-2" />
              )}
              <span className="font-medium">{groupTitles[group]}</span>
              <span className="ml-2 text-gray-500">({groupOrders.length})</span>
            </div>

            {expandedGroups.includes(group) && (
              <div className="space-y-4">
                {groupOrders.map(order => (
                  <OrderCard 
                    key={order.number}
                    order={order}
                    onUploadPhoto={handleUploadPhoto}
                    onRespondToClientReaction={handleRespondToClientReaction}
                    onClick={handleOrderClick}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Десктопная версия
  const DesktopView = () => (
    <div className="hidden sm:block">
      <PageLayout header={header}>
        {Object.entries(orders).map(([group, groupOrders]) => (
          <PageSection
            key={group}
            title={
              <div className="flex items-center">
                <span className="font-medium">{groupTitles[group]}</span>
                <Badge variant="primary" className="ml-2">
                  {groupOrders.length}
                </Badge>
              </div>
            }
            className="mb-6"
          >
            {/* Заголовок таблицы */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-500">
              <div className="col-span-2">Номер</div>
              <div className="col-span-3">Клиент</div>
              <div className="col-span-3">Состав заказа</div>
              <div className="col-span-2">Доставка</div>
              <div className="col-span-2 text-right">Действия</div>
            </div>

            {/* Строки заказов */}
            {groupOrders.map(order => (
              <div 
                key={order.number}
                className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => handleOrderClick(order.number)}
              >
                {/* Номер и статус */}
                <div className="col-span-2">
                  <div className="flex items-center">
                    <span className="font-medium">№{order.number}</span>
                    {order.urgent && (
                      <Badge variant="danger" className="ml-2">Срочно</Badge>
                    )}
                  </div>
                  <Badge 
                    variant={statusColors[order.status]} 
                    className="mt-1"
                  >
                    {order.status}
                  </Badge>
                </div>

                {/* Клиент */}
                <div className="col-span-3">
                  <div className="font-medium">{order.client}</div>
                  <div className="text-sm text-gray-600">{order.phone}</div>
                </div>

                {/* Сосав заказа */}
                <div className="col-span-3">
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.description}</span>
                        <span className="font-medium">{item.price}</span>
                      </div>
                    ))}
                    <div className="text-sm font-medium text-green-600">
                      Итого: {order.totalPrice}
                    </div>
                  </div>
                </div>

                {/* Доставка */}
                <div className="col-span-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={14} className="mr-1" />
                    {order.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin size={14} className="mr-1" />
                    {order.address}
                  </div>
                </div>

                {/* Действия */}
                <div className="col-span-2 flex justify-end items-center space-x-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Phone size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `tel:${order.client}`;
                    }}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<MessageCircle size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://wa.me/${order.client.replace(/[^0-9]/g, '')}`);
                    }}
                  />
                  {(order.status === 'Оплачен' || order.status === 'В работе') && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Upload size={16} />}
                      onClick={() => handleUploadPhoto(order.number)}
                    />
                  )}
                </div>
              </div>
            ))}
          </PageSection>
        ))}
      </PageLayout>
    </div>
  );

  return (
    <>
      <MobileView />
      <DesktopView />
    </>
  );
}

export default OrdersPage; 