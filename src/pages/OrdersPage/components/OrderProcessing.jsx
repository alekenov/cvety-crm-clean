import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MessageCircle, Camera, MapPin, 
  ThumbsUp, ThumbsDown, Gift, Clock, Map, AlertTriangle, X 
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

// Order status constants
const ORDER_STATUS = {
  NEW: 'new',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  PHOTO_UPLOADED: 'photo_uploaded',
  READY_FOR_DELIVERY: 'ready_for_delivery',
  IN_DELIVERY: 'in_delivery',
  DELIVERED: 'delivered',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PROBLEM: 'problem'
};

// Initial states
const INITIAL_DELIVERY_INFO = {
  address: '',
  apartment: '',
  entrance: '',
  comment: '',
  cost: null,
  distance: null
};

// Mock orders data for testing
const mockOrders = [
  {
    number: '№1234',
    totalPrice: '15,000 ₸',
    date: '2024-11-18',
    time: '14:00',
    status: 'В работе',
    client: '+7 (777) 123-45-67',
    address: 'ул. Абая, 1',
    shop: 'Центральный',
    florist: 'Анна',
    deliveryType: 'delivery',
    items: [
      { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Весенний"', price: '10,000 ₸' },
      { image: '/placeholder.svg?height=48&width=48', description: 'Открытка', price: '500 ₸' },
    ],
    clientComment: 'Пожалуйста, добавьте больше розовых цветов',
  },
  {
    number: '№1235',
    totalPrice: '8,000 ₸',
    date: '2024-11-19',
    time: '16:30',
    status: 'Оплачен',
    client: '+7 (777) 987-65-43',
    address: 'пр. Достык, 5',
    shop: 'Южный',
    deliveryType: 'pickup',
    items: [
      { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Летний"', price: '8,000 ₸' },
    ],
  },
  {
    number: '№1236',
    totalPrice: '20,000 ₸',
    date: '2024-11-18',
    time: '10:00',
    status: 'Не оплачен',
    client: '+7 (777) 111-22-33',
    address: 'ул. Жандосова, 55',
    shop: 'Западный',
    deliveryType: 'delivery',
    items: [
      { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Роскошь"', price: '18,000 ₸' },
      { image: '/placeholder.svg?height=48&width=48', description: 'Ваза', price: '2,000 ₸' },
    ],
  },
  {
    number: '№1237',
    totalPrice: '12,000 ₸',
    date: '2024-11-20',
    time: '11:30',
    status: 'Готов к самовывозу',
    client: '+7 (777) 444-55-66',
    address: 'ул. Толе би, 59',
    shop: 'Восточный',
    deliveryType: 'pickup',
    items: [
      { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Нежность"', price: '12,000 ₸' },
    ],
  },
  {
    number: '№1238',
    totalPrice: '25,000 ₸',
    date: '2024-11-18',
    time: '13:45',
    status: 'В пути',
    client: '+7 (777) 777-88-99',
    address: 'мкр. Самал-2, д. 33',
    shop: 'Центральный',
    deliveryType: 'delivery',
    items: [
      { image: '/placeholder.svg?height=48&width=48', description: 'Букет "Экзотика"', price: '22,000 ₸' },
      { image: '/placeholder.svg?height=48&width=48', description: 'Шоколад', price: '3,000 ₸' },
    ],
    deliveryProblem: 'Клиент не отвечает на звонки',
  },
];

// Order status display component
const OrderStatus = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case ORDER_STATUS.NEW:
        return 'bg-blue-100 text-blue-800';
      case ORDER_STATUS.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case ORDER_STATUS.REJECTED:
        return 'bg-red-100 text-red-800';
      case ORDER_STATUS.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case ORDER_STATUS.PHOTO_UPLOADED:
        return 'bg-purple-100 text-purple-800';
      case ORDER_STATUS.READY_FOR_DELIVERY:
        return 'bg-indigo-100 text-indigo-800';
      case ORDER_STATUS.IN_DELIVERY:
        return 'bg-cyan-100 text-cyan-800';
      case ORDER_STATUS.DELIVERED:
        return 'bg-emerald-100 text-emerald-800';
      case ORDER_STATUS.COMPLETED:
        return 'bg-teal-100 text-teal-800';
      case ORDER_STATUS.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case ORDER_STATUS.PROBLEM:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case ORDER_STATUS.NEW:
        return 'Новый заказ';
      case ORDER_STATUS.ACCEPTED:
        return 'Принят';
      case ORDER_STATUS.REJECTED:
        return 'Отклонен';
      case ORDER_STATUS.IN_PROGRESS:
        return 'В работе';
      case ORDER_STATUS.PHOTO_UPLOADED:
        return 'Фото загружено';
      case ORDER_STATUS.READY_FOR_DELIVERY:
        return 'Готов к доставке';
      case ORDER_STATUS.IN_DELIVERY:
        return 'В доставке';
      case ORDER_STATUS.DELIVERED:
        return 'Доставлен';
      case ORDER_STATUS.COMPLETED:
        return 'Завершен';
      case ORDER_STATUS.CANCELLED:
        return 'Отменен';
      case ORDER_STATUS.PROBLEM:
        return 'Проблема';
      default:
        return 'Неизвестный статус';
    }
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
      {getStatusText()}
    </div>
  );
};

const OrderProcessing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(ORDER_STATUS.NEW);
  const [photo, setPhoto] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(INITIAL_DELIVERY_INFO);
  const [showCourierComment, setShowCourierComment] = useState(false);
  const [customerRating, setCustomerRating] = useState(null);
  const [courierInfo, setCourierInfo] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [problemDescription, setProblemDescription] = useState('');

  // Memoized functions
  const loadOrder = useCallback(async () => {
    if (!id) {
      setError('ID заказа не указан');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Clean the ID to ensure we only have numbers
      const cleanId = String(id).replace(/[^0-9]/g, '');
      console.log('Loading order:', { originalId: id, cleanId });

      // Try mock data first for testing
      const mockOrder = mockOrders.find(order => 
        String(order.number).replace(/[^0-9]/g, '') === cleanId
      );

      if (mockOrder) {
        console.log('Using mock order data:', mockOrder);
        setOrderData(mockOrder);
        setOrderStatus(mockOrder.status || ORDER_STATUS.NEW);
        setDeliveryInfo({
          address: mockOrder.address || '',
          apartment: mockOrder.apartment || '',
          entrance: mockOrder.entrance || '',
          comment: mockOrder.delivery_comment || '',
          cost: mockOrder.delivery_cost || null,
          distance: mockOrder.delivery_distance || null
        });
        setLoading(false);
        return;
      }

      // If no mock order found, try to fetch from Supabase
      const { data, error: supabaseError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('number', cleanId)
        .maybeSingle();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error('Ошибка при загрузке заказа из базы данных');
      }

      if (!data) {
        throw new Error('Заказ не найден');
      }

      console.log('Order loaded from Supabase:', data);
      setOrderData(data);
      setOrderStatus(data.status || ORDER_STATUS.NEW);
      setDeliveryInfo({
        address: data.address || '',
        apartment: data.apartment || '',
        entrance: data.entrance || '',
        comment: data.delivery_comment || '',
        cost: data.delivery_cost || null,
        distance: data.delivery_distance || null
      });
    } catch (err) {
      console.error('Error in loadOrder:', err);
      setError(err.message || 'Произошла ошибка при загрузке заказа');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load order data on component mount or id change
  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // Status update handler with optimistic updates
  const handleStatusUpdate = useCallback(async (newStatus) => {
    if (!id || !Object.values(ORDER_STATUS).includes(newStatus)) {
      console.error('Invalid status update:', { id, newStatus });
      return;
    }

    try {
      // Optimistic update
      setOrderStatus(newStatus);

      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('number', id);

      if (updateError) {
        throw updateError;
      }

      // Reload order data to ensure consistency
      await loadOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      // Revert optimistic update
      setOrderStatus(orderData?.status || ORDER_STATUS.NEW);
      setError('Ошибка при обновлении статуса заказа');
    }
  }, [id, orderData?.status, loadOrder]);

  // Navigation handlers
  const handleBack = useCallback(() => {
    navigate('/orders');
  }, [navigate]);

  // Order action handlers
  const handleAcceptOrder = useCallback(() => 
    handleStatusUpdate(ORDER_STATUS.ACCEPTED), [handleStatusUpdate]);

  const handleRejectOrder = useCallback(() => 
    handleStatusUpdate(ORDER_STATUS.REJECTED), [handleStatusUpdate]);

  const handlePhotoUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement actual photo upload to storage
      setPhoto(URL.createObjectURL(file));
      handleStatusUpdate(ORDER_STATUS.PHOTO_UPLOADED);
    }
  }, [handleStatusUpdate]);

  const handleAddressSubmit = useCallback(() => {
    if (deliveryInfo.address) {
      handleStatusUpdate(ORDER_STATUS.READY_FOR_DELIVERY);
      setDeliveryInfo(prev => ({
        ...prev,
        cost: 1000, // TODO: Implement actual delivery cost calculation
        distance: 5.2 // TODO: Implement actual distance calculation
      }));
      setCourierInfo({
        name: "Алексей",
        arrivalTime: "15:30"
      });
    } else {
      setError('Пожалуйста, введите адрес доставки');
    }
  }, [deliveryInfo.address, handleStatusUpdate]);

  const handleDeliveryComplete = useCallback(() => {
    handleStatusUpdate(ORDER_STATUS.DELIVERED);
  }, [handleStatusUpdate]);

  // UI Components
  const renderProductInfo = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center">
        <img src={orderData?.image_url || "https://picsum.photos/200"} alt="Букет" className="w-20 h-20 object-cover rounded-lg mr-4" />
        <div>
          <h3 className="font-semibold">Букет</h3>
          <p className="text-green-600 font-bold">{orderData?.total_price?.toLocaleString() || "0"} ₸</p>
        </div>
      </div>
    </div>
  );

  const renderCommentAndCard = () => (
    <div className="space-y-4 mb-4">
      {orderData?.client_comment && (
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-800">{orderData?.client_comment}</p>
        </div>
      )}
      {orderData?.card_text && (
        <div className="bg-pink-50 rounded-lg p-4 shadow-sm flex items-start">
          <Gift size={20} className="text-pink-500 mr-2 flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-800 italic">"{orderData?.card_text}"</p>
        </div>
      )}
    </div>
  );

  const renderPhotoBeforeDelivery = () => (
    photo && (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex items-start">
          <img src={photo} alt="Собранный букет" className="w-24 h-32 object-cover rounded-lg mr-4" />
          <div>
            <h3 className="font-semibold mb-2">Фото собранного букета</h3>
            {customerRating === null ? (
              <p className="text-sm text-gray-600 mb-2">Ожидается оценка от заказчика</p>
            ) : (
              <p className={`text-sm ${customerRating ? 'text-green-600' : 'text-red-600'} mb-2`}>
                Заказчику {customerRating ? 'понравился' : 'не понравился'} букет
              </p>
            )}
            <div className="flex">
              <button 
                className={`mr-2 p-1 rounded ${customerRating === true ? 'bg-green-100' : ''}`}
                onClick={() => setCustomerRating(true)}
              >
                <ThumbsUp size={20} className={customerRating === true ? 'text-green-500' : 'text-gray-400'} />
              </button>
              <button 
                className={`p-1 rounded ${customerRating === false ? 'bg-red-100' : ''}`}
                onClick={() => setCustomerRating(false)}
              >
                <ThumbsDown size={20} className={customerRating === false ? 'text-red-500' : 'text-gray-400'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderOrderDetails = () => (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Детали заказа</h3>
          <OrderStatus status={orderStatus} />
        </div>
        <p><span className="font-semibold">Дата и время:</span> {orderData?.delivery_date ? new Date(orderData?.delivery_date).toLocaleDateString('ru-RU') + (orderData?.delivery_time ? `, ${orderData?.delivery_time}` : '') : 'Не указано'}</p>
        <p><span className="font-semibold">Получатель:</span> {orderData?.client_name || 'Клиент'}</p>
        <p className="flex items-center">
          <span className="font-semibold mr-2">Телефон:</span> 
          {orderData?.client_phone}
          <Phone size={20} className="ml-2 text-green-500 cursor-pointer" />
          <MessageCircle size={20} className="ml-2 text-green-500 cursor-pointer" />
        </p>
        {deliveryInfo.address && (
          <>
            <p><span className="font-semibold">Адрес:</span> {deliveryInfo.address}</p>
            {(deliveryInfo.apartment || deliveryInfo.entrance) && (
              <p>
                {deliveryInfo.apartment && <span><span className="font-semibold">Кв:</span> {deliveryInfo.apartment}</span>}
                {deliveryInfo.entrance && <span className="ml-2"><span className="font-semibold">Подъезд:</span> {deliveryInfo.entrance}</span>}
              </p>
            )}
            {deliveryInfo.comment && <p><span className="font-semibold">Комментарий:</span> {deliveryInfo.comment}</p>}
            {deliveryInfo.cost && (
              <p>
                <span className="font-semibold">Доставка:</span> {deliveryInfo.cost.toLocaleString()} ₸ ({deliveryInfo.distance} км)
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );

  const renderOrderActions = () => {
    switch (orderStatus) {
      case ORDER_STATUS.NEW:
        return (
          <div className="space-y-2 mt-4">
            <button 
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold" 
              onClick={handleAcceptOrder}
            >
              Принять заказ
            </button>
            <button 
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold" 
              onClick={handleRejectOrder}
            >
              Отказаться от заказа
            </button>
          </div>
        );
      case ORDER_STATUS.ACCEPTED:
        return (
          <div className="mt-4">
            <label className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold text-center cursor-pointer inline-block">
              <Camera className="inline-block mr-2" />
              Загрузить фото букета
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
        );
      case ORDER_STATUS.PHOTO_UPLOADED:
        return (
          <div className="mt-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-blue-800">Пожалуйста, введите адрес доставки в форме выше</p>
            </div>
          </div>
        );
      case ORDER_STATUS.READY_FOR_DELIVERY:
      case ORDER_STATUS.DELIVERED:
        return (
          <div className="mt-4 space-y-2">
            {courierInfo && (
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="font-semibold">Курьер: {courierInfo.name}</p>
                <p>Ожидаемое время прибытия: {courierInfo.arrivalTime}</p>
              </div>
            )}
            {orderStatus !== ORDER_STATUS.DELIVERED && (
              <button 
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold" 
                onClick={handleDeliveryComplete}
              >
                Доставлен
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const renderProblemStatus = () => (
    <div className="bg-red-100 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <AlertTriangle className="text-red-500 mr-2 mt-1" size={20} />
          <div>
            <p className="font-semibold text-red-700">Проблема с заказом</p>
            <p className="text-red-600">{problemDescription}</p>
          </div>
        </div>
        <button onClick={() => {setOrderStatus(ORDER_STATUS.PHOTO_UPLOADED); setProblemDescription('');}}>
          <X size={20} className="text-red-500" />
        </button>
      </div>
    </div>
  );

  const renderPaymentModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h3 className="font-semibold mb-4 text-lg">Запрос доплаты</h3>
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          placeholder="Сумма доплаты"
          className="w-full p-2 border rounded-lg mb-4"
          style={{ appearance: 'textfield' }}
        />
        <div className="flex flex-col space-y-2">
          <button 
            className="bg-blue-500 text-white py-2 px-4 rounded-lg" 
            onClick={() => alert(`Запрос на доплату на сумму ${paymentAmount} ₸ отправлен`)}
          >
            Запросить доплату
          </button>
          <button 
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg" 
            onClick={() => setShowPaymentModal(false)}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );

  const renderRefundModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <h3 className="font-semibold mb-4 text-lg">Возврат средств</h3>
        <input
          type="number"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
          placeholder="Сумма возврата"
          className="w-full p-2 border rounded-lg mb-4"
          style={{ appearance: 'textfield' }}
        />
        <div className="flex flex-col space-y-2">
          <button 
            className="bg-red-500 text-white py-2 px-4 rounded-lg" 
            onClick={() => alert(`Запрос на возврат на сумму ${paymentAmount} ₸ отправлен`)}
          >
            Выполнить возврат
          </button>
          <button 
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg" 
            onClick={() => setShowRefundModal(false)}
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Заказ не найден</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-full mr-4"
            onClick={handleBack}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Заказ {id}</h1>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      ) : !orderData ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Заказ не найден</p>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-6xl mx-auto p-4">
            <div className="sm:hidden">
              {/* Mobile View */}
              {renderProductInfo()}
              {renderCommentAndCard()}
              {orderStatus !== ORDER_STATUS.NEW && renderPhotoBeforeDelivery()}
              {orderStatus === ORDER_STATUS.PROBLEM && renderProblemStatus()}
              {renderOrderDetails()}
              {renderOrderActions()}
              <div className="mt-4 space-x-2 text-center">
                <button 
                  className="text-blue-500 font-semibold" 
                  onClick={() => setShowPaymentModal(true)}
                >
                  Запросить доплату
                </button>
                <button 
                  className="text-red-500 font-semibold" 
                  onClick={() => setShowRefundModal(true)}
                >
                  Возврат
                </button>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  {renderProductInfo()}
                  {renderCommentAndCard()}
                  {orderStatus !== ORDER_STATUS.NEW && renderPhotoBeforeDelivery()}
                  {orderStatus === ORDER_STATUS.PROBLEM && renderProblemStatus()}
                  {renderOrderDetails()}
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="font-semibold mb-4">Статус заказа</h2>
                    {renderOrderActions()}
                  </div>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <h2 className="font-semibold mb-4">Дополнительные действия</h2>
                    <div className="space-y-2">
                      <button 
                        className="w-full text-blue-500 font-semibold py-2 px-4 rounded-lg border border-blue-500" 
                        onClick={() => setShowPaymentModal(true)}
                      >
                        Запросить доплату
                      </button>
                      <button 
                        className="w-full text-red-500 font-semibold py-2 px-4 rounded-lg border border-red-500" 
                        onClick={() => setShowRefundModal(true)}
                      >
                        Возврат
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {showPaymentModal && renderPaymentModal()}
            {showRefundModal && renderRefundModal()}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderProcessing;