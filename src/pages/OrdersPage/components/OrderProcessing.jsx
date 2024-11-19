import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MessageCircle, Camera, MapPin, 
  ThumbsUp, ThumbsDown, Gift, Clock, Map, AlertTriangle, X 
} from 'lucide-react';
import { supabase } from '../../../lib/supabase';

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

const OrderProcessing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState('new');
  const [photo, setPhoto] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    apartment: '',
    entrance: '',
    comment: '',
    cost: null,
    distance: null
  });
  const [showCourierComment, setShowCourierComment] = useState(false);
  const [customerRating, setCustomerRating] = useState(null);
  const [courierInfo, setCourierInfo] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [problemDescription, setProblemDescription] = useState('');

  useEffect(() => {
    if (id) {
      console.log('Loading order with ID:', id);
      loadOrder();
    }
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Clean the ID to ensure we only have numbers
      const cleanId = String(id).replace(/[^0-9]/g, '');
      console.log('Original ID:', id);
      console.log('Cleaned ID:', cleanId);

      // For testing purposes, let's use mock data first
      const mockOrder = mockOrders.find(order => {
        const orderNumber = String(order.number).replace(/[^0-9]/g, '');
        return orderNumber === cleanId;
      });

      if (mockOrder) {
        console.log('Found mock order:', mockOrder);
        setOrderData(mockOrder);
        setOrderStatus(mockOrder.status || 'new');
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
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('number', cleanId)
        .maybeSingle();

      if (error) {
        console.error('Error loading order:', error);
        setError(error.message);
        return;
      }

      if (!data) {
        console.log('No order found with ID:', cleanId);
        setError('Заказ не найден');
        return;
      }

      console.log('Order data loaded:', data);
      setOrderData(data);
      setOrderStatus(data.status || 'new');
      setDeliveryInfo({
        address: data.address || '',
        apartment: data.apartment || '',
        entrance: data.entrance || '',
        comment: data.delivery_comment || '',
        cost: data.delivery_cost || null,
        distance: data.delivery_distance || null
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Произошла ошибка при загрузке заказа');
    } finally {
      setLoading(false);
    }
  };

  // Обновление статуса заказа
  const handleStatusUpdate = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('number', id);

      if (error) throw error;

      setOrderStatus(newStatus);
      loadOrder(); // Перезагружаем заказ для обновления всех данных
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleBack = () => {
    navigate('/orders');
  };

  const handleAcceptOrder = () => handleStatusUpdate('accepted');
  const handleRejectOrder = () => alert('Заказ отклонен');
  
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      handleStatusUpdate('photoUploaded');
    }
  };

  const handleAddressSubmit = () => {
    if (deliveryInfo.address) {
      handleStatusUpdate('readyForDelivery');
      setDeliveryInfo(prev => ({
        ...prev,
        cost: 1000,
        distance: 5.2
      }));
      setCourierInfo({
        name: "Алексей",
        arrivalTime: "15:30"
      });
    } else {
      alert('Пожалуйста, введите адрес доставки');
    }
  };

  const handleDeliveryComplete = () => {
    handleStatusUpdate('delivered');
    alert('Заказ отмечен как доставленный');
  };

  const handleMapSelect = () => {
    alert('Здесь будет открываться карта для выбора адреса');
  };

  const handlePaymentRequest = () => {
    if (paymentAmount) {
      alert(`Запрос на доплату на сумму ${paymentAmount} ₸ отправлен`);
      setShowPaymentModal(false);
      setPaymentAmount('');
    }
  };

  const handleRefund = () => {
    if (paymentAmount) {
      alert(`Запрос на возврат на сумму ${paymentAmount} �� отправлен`);
      setShowRefundModal(false);
      setPaymentAmount('');
    }
  };

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
      case 'new':
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
      case 'accepted':
        return (
          <div className="mt-4">
            <label className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold text-center cursor-pointer inline-block">
              <Camera className="inline-block mr-2" />
              Загрузить фото букета
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
        );
      case 'photoUploaded':
        return (
          <div className="mt-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-blue-800">Пожалуйста, введите адрес доставки в форме выше</p>
            </div>
          </div>
        );
      case 'readyForDelivery':
      case 'delivered':
        return (
          <div className="mt-4 space-y-2">
            {courierInfo && (
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="font-semibold">Курьер: {courierInfo.name}</p>
                <p>Ожидаемое время прибытия: {courierInfo.arrivalTime}</p>
              </div>
            )}
            {orderStatus !== 'delivered' && (
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
        <button onClick={() => {setOrderStatus('photoUploaded'); setProblemDescription('');}}>
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
            onClick={handlePaymentRequest}
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
            onClick={handleRefund}
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
              {orderStatus !== 'new' && renderPhotoBeforeDelivery()}
              {orderStatus === 'problem' && renderProblemStatus()}
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
                  {orderStatus !== 'new' && renderPhotoBeforeDelivery()}
                  {orderStatus === 'problem' && renderProblemStatus()}
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