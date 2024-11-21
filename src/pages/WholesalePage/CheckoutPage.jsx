import React, { useState } from 'react';
import { ChevronLeft, Truck, Store, CreditCard, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Моковые данные заказа
  const orderSummary = {
    items: 5,
    totalQuantity: 125,
    totalSum: 45000,
  };

  const deliveryMethods = [
    {
      id: 'pickup',
      name: 'Самовывоз',
      description: 'Пункт выдачи на ул. Абая 150',
      icon: Store,
      price: 0
    },
    {
      id: 'delivery',
      name: 'Доставка',
      description: 'Доставка в пределах города',
      icon: Truck,
      price: 2000
    }
  ];

  const paymentMethods = [
    {
      id: 'card',
      name: 'Оплата картой',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard
    },
    {
      id: 'cash',
      name: 'Наличными',
      description: 'При получении заказа',
      icon: Wallet
    }
  ];

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    // Здесь будет логика обработки заказа
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/purchase/confirmation');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10">
        <div className="flex items-center p-4">
          <Link to="/purchase" className="flex items-center text-gray-600">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="flex-1 text-center font-semibold">Оформление заказа</h1>
          <div className="w-5"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 pb-32">
        <div className="max-w-2xl mx-auto px-4">
          {/* Delivery Method */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-4">Способ получения</h2>
            <div className="space-y-3">
              {deliveryMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    deliveryMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={method.id}
                    checked={deliveryMethod === method.id}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    className="sr-only"
                  />
                  <method.icon className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="ml-3 flex-1">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                  {method.price > 0 && (
                    <div className="text-sm font-medium">
                      {method.price.toLocaleString()} ₸
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-4">Способ оплаты</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    paymentMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="sr-only"
                  />
                  <method.icon className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="ml-3">
                    <div className="font-medium">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h2 className="font-semibold mb-4">Ваш заказ</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Товары ({orderSummary.items})</span>
                <span>{orderSummary.totalSum.toLocaleString()} ₸</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Количество</span>
                <span>{orderSummary.totalQuantity} шт</span>
              </div>
              {deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Доставка</span>
                  <span>2 000 ₸</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Итого</span>
                  <span>
                    {(orderSummary.totalSum + (deliveryMethod === 'delivery' ? 2000 : 0)).toLocaleString()} ₸
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fixed button - place it above the tab bar */}
      <div className="fixed left-0 right-0 bottom-[calc(env(safe-area-inset-bottom)+3.5rem)] bg-white border-t border-gray-200">
        <div className="max-w-2xl mx-auto">
          <div className="p-4">
            <button
              onClick={handleConfirmOrder}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-3 lg:py-2.5 rounded-lg font-medium disabled:bg-blue-400 hover:bg-blue-700 transition-colors"
            >
              {isProcessing ? 'Обработка...' : 'Подтвердить заказ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
