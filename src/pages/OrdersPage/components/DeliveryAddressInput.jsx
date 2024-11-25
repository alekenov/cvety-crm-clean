import React, { useState } from 'react';
import { Map, AlertTriangle, X } from 'lucide-react';

const DeliveryAddressInput = ({ 
  orderStatus, 
  deliveryInfo, 
  setDeliveryInfo, 
  onStatusChange,
  problemDescription,
  setProblemDescription 
}) => {
  const [showCourierComment, setShowCourierComment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  const handleMapSelect = () => {
    alert('Здесь будет открываться карта для выбора адреса');
  };

  const handleAddressSubmit = () => {
    if (deliveryInfo.address) {
      onStatusChange('readyForDelivery');
      alert('Адрес подтвержден, курьер вызван');
    } else {
      alert('Пожалуйста, введите адрес доставки');
    }
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
      alert(`Запрос на возврат на сумму ${paymentAmount} ₸ отправлен`);
      setShowRefundModal(false);
      setPaymentAmount('');
    }
  };

  const renderAddressInput = () => (
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
          <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={handlePaymentRequest}>
            Запросить доплату
          </button>
          <button className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg" onClick={() => setShowPaymentModal(false)}>
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
          <button className="bg-red-500 text-white py-2 px-4 rounded-lg" onClick={handleRefund}>
            Выполнить возврат
          </button>
          <button className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg" onClick={() => setShowRefundModal(false)}>
            Отмена
          </button>
        </div>
      </div>
    </div>
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
        <button onClick={() => {onStatusChange('photoUploaded'); setProblemDescription('');}}>
          <X size={20} className="text-red-500" />
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {orderStatus === 'problem' ? renderProblemStatus() : renderAddressInput()}

      <div className="mt-4 space-x-2 text-center">
        <button className="text-blue-500 font-semibold" onClick={() => setShowPaymentModal(true)}>
          Запросить доплату
        </button>
        <button className="text-red-500 font-semibold" onClick={() => setShowRefundModal(true)}>
          Возврат
        </button>
      </div>

      {showPaymentModal && renderPaymentModal()}
      {showRefundModal && renderRefundModal()}
    </div>
  );
};

export default DeliveryAddressInput;
