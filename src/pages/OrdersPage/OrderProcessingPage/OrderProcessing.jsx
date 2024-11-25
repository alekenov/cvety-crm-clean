import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, Camera, MapPin, ThumbsUp, ThumbsDown, Gift, AlertTriangle, X, Map, Minus, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import FlowerWriteOff from '../components/FlowerWriteOff';
import DeliveryAddressInput from '../components/DeliveryAddressInput';
import { ORDER_STATUS, getStatusLabel, getNextStatuses } from '../../../constants/orderStatuses';
import Modal from '../../../components/Modal';
import { logger } from '../../../services/logging/loggingService';

const mockOrders = [
  {
    id: '1234',
    number: '№1234',
    totalPrice: '15,000 ₸',
    date: '2024-03-24',
    time: '14:30',
    status: ORDER_STATUS.NEW,
    deliveryType: 'delivery',
    address: 'ул. Абая 150, кв. 25',
    comment: 'Добрый день! Большая просьба собрать композицию цветов из нежно розового оттенка',
    card: 'С любовью, Айдос',
    details: {
      total: 15000,
      recipient: {
        name: 'Айгерим Сатпаева',
        phone: '+7 (777) 123-45-67',
      },
    },
    items: [
      { id: 1, name: 'Розы красные', quantity: 11, price: '1,000 ₸' },
      { id: 2, name: 'Упаковка премиум', quantity: 1, price: '4,000 ₸' }
    ],
    hasPhoto: false,
    hasClientReaction: false
  },
  {
    id: '1235',
    number: '№1235',
    totalPrice: '12,500 ₸',
    date: '2024-03-24',
    time: '15:00',
    status: ORDER_STATUS.NEW,
    deliveryType: 'delivery',
    address: 'ул. Достык 123, кв. 45',
    comment: 'Хочу букет в бело-розовых тонах',
    card: 'С днем рождения!',
    details: {
      total: 12500,
      recipient: {
        name: 'Динара Касымова',
        phone: '+7 (777) 987-65-43',
      },
    },
    items: [
      { id: 1, name: 'Белые розы', quantity: 7, price: '1,500 ₸' },
      { id: 2, name: 'Розовые пионы', quantity: 3, price: '2,000 ₸' }
    ],
    hasPhoto: false,
    hasClientReaction: false
  },
  {
    id: '1236',
    number: '№1236',
    totalPrice: '18,000 ₸',
    date: '2024-03-24',
    time: '16:30',
    status: ORDER_STATUS.NEW,
    deliveryType: 'delivery',
    address: 'ул. Сатпаева 90, кв. 12',
    comment: 'Букет на день рождения, яркие цвета',
    card: 'Поздравляю с днем рождения!',
    details: {
      total: 18000,
      recipient: {
        name: 'Марат Сериков',
        phone: '+7 (777) 555-44-33',
      },
    },
    items: [
      { id: 1, name: 'Тюльпаны красные', quantity: 15, price: '800 ₸' },
      { id: 2, name: 'Герберы оранжевые', quantity: 5, price: '1,200 ₸' },
      { id: 3, name: 'Упаковка стандарт', quantity: 1, price: '3,000 ₸' }
    ],
    hasPhoto: false,
    hasClientReaction: false
  },
  {
    id: '1237',
    number: '№1237',
    totalPrice: '32,000 ₸',
    date: '2024-03-24',
    time: '17:30',
    status: ORDER_STATUS.COLLECTED,
    deliveryType: 'delivery',
    address: 'ул. Жандосова 58, кв. 89',
    comment: 'Доставить до 18:00',
    card: 'С наилучшими пожеланиями!',
    details: {
      total: 32000,
      recipient: {
        name: 'Асель Маратова',
        phone: '+7 (708) 456-78-90',
      },
    },
    items: [
      { id: 1, name: 'Пионы розовые', quantity: 7, price: '4,000 ₸' },
      { id: 2, name: 'Упаковка люкс', quantity: 1, price: '5,000 ₸' }
    ],
    hasPhoto: true,
    hasClientReaction: false
  }
];

const OrderProcessing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(ORDER_STATUS.NEW);
  const [showStatusModal, setShowStatusModal] = useState(false);
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
  const [refundAmount, setRefundAmount] = useState('');
  const [problemDescription, setProblemDescription] = useState('');

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!id) {
        logger.warn('OrderProcessing', 'No order ID provided');
        return;
      }

      setLoading(true);
      logger.log('OrderProcessing', `Searching for order with ID: ${id}`);

      try {
        // Ищем заказ по номеру в mockOrders
        const mockOrder = mockOrders.find(order => {
          const orderNumber = order.number.replace(/[^0-9]/g, '');
          logger.debug('OrderProcessing', `Comparing order numbers: ${orderNumber} === ${id}`);
          return orderNumber === id;
        });
        
        if (mockOrder) {
          logger.log('OrderProcessing', 'Found order', { 
            orderNumber: mockOrder.number,
            status: mockOrder.status,
            recipient: mockOrder.details.recipient.name
          });
          setOrderData(mockOrder);
          setOrderStatus(mockOrder.status || ORDER_STATUS.NEW);
        } else {
          logger.error('OrderProcessing', `Order not found for ID: ${id}`);
          navigate('/orders');
        }
      } catch (error) {
        logger.error('OrderProcessing', 'Error fetching order', { error: error.message });
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id, navigate]);

  // Показываем загрузку только когда реально что-то загружаем
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-lg">Загрузка заказа...</div>
      </div>
    );
  }

  // Не показываем ничего, пока нет данных
  if (!orderData) {
    return null;
  }

  const handleAcceptOrder = () => setOrderStatus(ORDER_STATUS.ACCEPTED);
  const handleRejectOrder = () => alert('Заказ отклонен');
  
  const handleFlowersSelected = () => {
    setOrderStatus(ORDER_STATUS.FLOWERS_SELECTED);
  };

  const handleDeliveryComplete = () => {
    setOrderStatus(ORDER_STATUS.DELIVERED);
    alert('Заказ отмечен как доставленный');
  };

  const handleRequestPayment = () => {
    if (paymentAmount) {
      alert(`Запрос на доплату на сумму ${paymentAmount} ₸ отправлен`);
      setShowPaymentModal(false);
      setPaymentAmount('');
    }
  };

  const handleProcessRefund = () => {
    if (refundAmount) {
      alert(`Запрос на возврат на сумму ${refundAmount} ₸ отправлен`);
      setShowRefundModal(false);
      setRefundAmount('');
    }
  };

  const handleMapSelect = () => {
    alert('Здесь будет открываться карта для выбора адреса');
  };

  const handleStatusChange = (newStatus) => {
    setOrderStatus(newStatus);
    setShowStatusModal(false);
  };

  const renderStatusModal = () => (
    <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)}>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Изменить статус заказа</h3>
        <div className="space-y-2">
          {getNextStatuses(orderStatus).map((status) => (
            <button
              key={status}
              onClick={() => {
                handleStatusChange(status);
                setShowStatusModal(false);
              }}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {getStatusLabel(status)}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );

  const renderPaymentModal = () => (
    <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Запросить оплату</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сумма
            </label>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Введите сумму"
            />
          </div>
          <button
            onClick={handleRequestPayment}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors"
          >
            Запросить оплату
          </button>
        </div>
      </div>
    </Modal>
  );

  const renderRefundModal = () => (
    <Modal isOpen={showRefundModal} onClose={() => setShowRefundModal(false)}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Оформить возврат</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сумма возврата
            </label>
            <input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              className="w-full p-2 border rounded-lg"
              placeholder="Введите сумму возврата"
            />
          </div>
          <button
            onClick={handleProcessRefund}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Оформить возврат
          </button>
        </div>
      </div>
    </Modal>
  );

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
        <button onClick={() => {setOrderStatus(ORDER_STATUS.FLOWERS_SELECTED); setProblemDescription('');}}>
          <X size={20} className="text-red-500" />
        </button>
      </div>
    </div>
  );

  const renderFlowerManagement = () => (
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">Состав букета</h4>
        <button 
          onClick={() => setShowStatusModal(true)}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <span>Статус:</span>
          <span className="font-semibold">
            {getStatusLabel(orderStatus)}
          </span>
        </button>
      </div>

      <FlowerWriteOff 
        onAddFlower={(flower) => {
          console.log('Added flower:', flower);
          // Handle adding flower to the order
        }}
        onWriteOff={(flowers) => {
          console.log('Writing off flowers:', flowers);
          // Handle writing off flowers
          alert(`Списано ${flowers.length} позиций`);
        }}
      />
    </div>
  );

  const renderProductInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <img 
          src={`/api/placeholder/100/100`} 
          alt={orderData.items[0].name} 
          className="w-20 h-20 object-cover rounded-lg mr-4" 
        />
        <div>
          <h3 className="font-semibold">{orderData.items[0].name}</h3>
          <p className="text-green-600 font-bold">{orderData.totalPrice}</p>
        </div>
      </div>
      {renderFlowerManagement()}
    </div>
  );

  const renderCommentAndCard = () => (
    <div className="space-y-4 mb-4">
      {orderData.comment && (
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-800">{orderData.comment}</p>
        </div>
      )}
      {orderData.card && (
        <div className="bg-pink-50 rounded-lg p-4 shadow-sm flex items-start">
          <Gift size={20} className="text-pink-500 mr-2 flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-800 italic">"{orderData.card}"</p>
        </div>
      )}
    </div>
  );

  const renderPhotoBeforeDelivery = () => (
    photo && (
      <div className="bg-white rounded-xl shadow-sm p-6">
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
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="space-y-2">
        <p><span className="font-semibold">Дата и время:</span> {orderData.date}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{orderData.details.recipient.name}</span>
            <span className="text-gray-500">{orderData.details.recipient.phone}</span>
          </div>
          <Phone size={20} className="ml-2 text-green-500 cursor-pointer" />
          <MessageCircle size={20} className="ml-2 text-green-500 cursor-pointer" />
        </div>
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

  const renderOrderItems = () => (
    <div className="space-y-2">
      {orderData.items.map((item) => (
        <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center">
            <span className="text-sm">{item.name} × {item.quantity}</span>
          </div>
          <span className="font-medium">{item.price}</span>
        </div>
      ))}
    </div>
  );

  const renderOrderActions = () => {
    switch (orderStatus) {
      case ORDER_STATUS.NEW:
        return (
          <div className="space-y-2">
            <button 
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors" 
              onClick={handleAcceptOrder}
            >
              Принять заказ
            </button>
            <button 
              className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-600 transition-colors" 
              onClick={handleRejectOrder}
            >
              Отказаться от заказа
            </button>
          </div>
        );
      case ORDER_STATUS.AWAITING_DELIVERY:
      case ORDER_STATUS.YANDEX_COURIER:
      case ORDER_STATUS.OWN_COURIER:
      case ORDER_STATUS.DELIVERING:
        return (
          <div className="space-y-4">
            {orderStatus === ORDER_STATUS.DELIVERY_PROBLEM && renderProblemStatus()}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={deliveryInfo.address}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, address: e.target.value})}
                  placeholder="Улица и номер дома"
                  className="flex-grow p-2 border rounded-lg"
                />
                <button 
                  onClick={handleMapSelect}
                  className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Map size={20} />
                </button>
              </div>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={deliveryInfo.apartment}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, apartment: e.target.value})}
                  placeholder="Квартира"
                  className="w-1/2 p-2 border rounded-lg"
                />
                <input
                  type="text"
                  value={deliveryInfo.entrance}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, entrance: e.target.value})}
                  placeholder="Подъезд"
                  className="w-1/2 p-2 border rounded-lg"
                />
              </div>
              <button 
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
                onClick={() => setShowCourierComment(!showCourierComment)}
              >
                {showCourierComment ? "Скрыть комментарий для курьера" : "Добавить комментарий для курьера"}
              </button>
              {showCourierComment && (
                <textarea
                  value={deliveryInfo.comment}
                  onChange={(e) => setDeliveryInfo({...deliveryInfo, comment: e.target.value})}
                  placeholder="Комментарий для курьера"
                  className="w-full p-2 border rounded-lg mt-2"
                  rows="3"
                />
              )}
            </div>
            {courierInfo && (
              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="font-semibold">Курьер: {courierInfo.name}</p>
                <p>Ожидаемое время прибытия: {courierInfo.arrivalTime}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex items-center mb-6">
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg"
          onClick={() => {
            logger.log('OrderProcessing', 'Navigating back to orders list');
            navigate('/orders');
          }}
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold flex-grow ml-4">Заказ {orderData.number}</h1>
        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-4 py-2 rounded-lg">
          {getStatusLabel(orderStatus)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {renderProductInfo()}
            {renderCommentAndCard()}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            {orderStatus !== ORDER_STATUS.NEW && renderPhotoBeforeDelivery()}
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            {renderOrderDetails()}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            {renderOrderItems()}
          </div>
        </div>

        {/* Right Column - Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {renderOrderActions()}
          </div>

          {orderStatus !== ORDER_STATUS.NEW && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Дополнительные действия</h3>
              <div className="flex flex-col space-y-3">
                <button 
                  className="w-full bg-blue-50 text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-100 transition-colors"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Запросить доплату
                </button>
                <button 
                  className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                  onClick={() => setShowRefundModal(true)}
                >
                  Возврат
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showPaymentModal && renderPaymentModal()}
      {showRefundModal && renderRefundModal()}
      {showStatusModal && renderStatusModal()}
    </div>
  );
};

export default OrderProcessing;