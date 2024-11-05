import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MessageCircle, Camera, MapPin, 
  ThumbsUp, ThumbsDown, Gift, Clock, Map, AlertTriangle, X 
} from 'lucide-react';

const OrderProcessing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  // Добавим эффект для инициализации состояния при монтировании
  useEffect(() => {
    // Здесь можно добавить загрузку данных заказа
    console.log('Loading order:', id);
    // Для примера установим начальный статус
    setOrderStatus('new');
  }, [id]);

  // Добавим эффект для отслеживания изменений статуса
  useEffect(() => {
    console.log('Order status changed:', orderStatus);
  }, [orderStatus]);

  // Здесь мы бы получали данные заказа по id
  const order = {
    id: id,
    product: { 
      id: 1, 
      name: 'Букет из 21 нежно-розовой розы', 
      price: 15000, 
      image: '/api/placeholder/100/100' 
    },
    card: 'Aika )) Misha xxoo.',
    comment: 'Добрый день! Большая просьба собрать композицию цветов из нежно розового оттенка, как на картинке',
    details: {
      total: 15000,
      date: '17.10.2024, Как можно скорее',
      recipient: {
        name: 'Aika',
        phone: '+77775626993',
      },
    },
  };

  const handleBack = () => {
    navigate('/orders');
  };

  const handleAcceptOrder = () => setOrderStatus('accepted');
  const handleRejectOrder = () => alert('Заказ отклонен');
  
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setOrderStatus('photoUploaded');
    }
  };

  const handleAddressSubmit = () => {
    if (deliveryInfo.address) {
      setOrderStatus('readyForDelivery');
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
    setOrderStatus('delivered');
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
        <img src={order.product.image} alt={order.product.name} className="w-20 h-20 object-cover rounded-lg mr-4" />
        <div>
          <h3 className="font-semibold">{order.product.name}</h3>
          <p className="text-green-600 font-bold">{order.product.price.toLocaleString()} ₸</p>
        </div>
      </div>
    </div>
  );

  const renderCommentAndCard = () => (
    <div className="space-y-4 mb-4">
      {order.comment && (
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-800">{order.comment}</p>
        </div>
      )}
      {order.card && (
        <div className="bg-pink-50 rounded-lg p-4 shadow-sm flex items-start">
          <Gift size={20} className="text-pink-500 mr-2 flex-shrink-0 mt-1" />
          <p className="text-sm text-gray-800 italic">"{order.card}"</p>
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
        <p><span className="font-semibold">Дата и время:</span> {order.details.date}</p>
        <p><span className="font-semibold">Получатель:</span> {order.details.recipient.name}</p>
        <p className="flex items-center">
          <span className="font-semibold mr-2">Телефон:</span> 
          {order.details.recipient.phone}
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

  // Мобильная версия
  const MobileView = () => (
    <div className="sm:hidden bg-gray-100 min-h-screen p-4">
      <div className="flex items-center mb-4">
        <button onClick={handleBack} className="mr-2">
          <ArrowLeft className="cursor-pointer" />
        </button>
        <h1 className="text-xl font-bold flex-grow">Заказ №{id}</h1>
        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded">
          {orderStatus === 'new' ? 'Новый' : 
           orderStatus === 'accepted' ? 'Принят' :
           orderStatus === 'photoUploaded' ? 'Фото загружено' :
           orderStatus === 'readyForDelivery' ? 'Готов к отправке' :
           orderStatus === 'delivered' ? 'Доставлен' : ''}
        </span>
      </div>

      {renderProductInfo()}
      {renderCommentAndCard()}
      {orderStatus !== 'new' && renderPhotoBeforeDelivery()}
      {orderStatus === 'photoUploaded' && (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
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
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
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
            className="text-blue-500 font-semibold mb-2"
            onClick={() => setShowCourierComment(!showCourierComment)}
          >
            {showCourierComment ? "Скрыть комментарий для курьера" : "Добавить комментарий для курьера"}
          </button>
          {showCourierComment && (
            <textarea
              value={deliveryInfo.comment}
              onChange={(e) => setDeliveryInfo({...deliveryInfo, comment: e.target.value})}
              placeholder="Комментарий для курьера"
              className="w-full p-2 border rounded-lg mb-2"
              rows="3"
            />
          )}
          <button 
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold mt-2" 
            onClick={handleAddressSubmit}
          >
            Подтвердить и вызвать курьера
          </button>
        </div>
      )}
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
  );

  // Десктопная версия
  const DesktopView = () => (
    <div className="hidden sm:block">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="mr-4">
            <ArrowLeft className="cursor-pointer" />
          </button>
          <h1 className="text-2xl font-bold flex-grow">Заказ №{id}</h1>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg">
            {orderStatus === 'new' ? 'Новый' : 
             orderStatus === 'accepted' ? 'Принят' :
             orderStatus === 'photoUploaded' ? 'Фото загружено' :
             orderStatus === 'readyForDelivery' ? 'Готов к отправке' :
             orderStatus === 'delivered' ? 'Доставлен' : ''}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Левая колонка: информация о заказе */}
          <div className="col-span-2 space-y-6">
            {renderProductInfo()}
            {renderCommentAndCard()}
            {orderStatus !== 'new' && renderPhotoBeforeDelivery()}
            {orderStatus === 'problem' && renderProblemStatus()}
            {renderOrderDetails()}
          </div>

          {/* Правая колонка: действия и статусы */}
          <div className="space-y-6">
            {/* Статус заказа */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold mb-4">Статус заказа</h2>
              {renderOrderActions()}
            </div>

            {/* Дополнительные действия */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="font-semibold mb-4">Дополнительные действия</h2>
              <div className="space-y-2">
                <button 
                  className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg font-medium"
                  onClick={() => setShowPaymentModal(true)}
                >
                  Запросить доплату
                </button>
                <button 
                  className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg font-medium"
                  onClick={() => setShowRefundModal(true)}
                >
                  Возврат
                </button>
              </div>
            </div>
          </div>
        </div>
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

  return (
    <>
      <MobileView />
      <DesktopView />
      {showPaymentModal && renderPaymentModal()}
      {showRefundModal && renderRefundModal()}
    </>
  );
};

export default OrderProcessing;