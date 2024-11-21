import React, { useState, useEffect } from 'react';
import { CheckCircle2, Timer, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function OrderConfirmationPage() {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // После истечения времени можно перенаправить пользователя
          navigate('/purchase');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="pt-4 pb-32">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Message */}
          <div className="bg-white rounded-lg p-6 mb-4 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Заказ успешно создан!</h1>
            <p className="text-gray-600 mb-4">
              Номер заказа: #123456
            </p>
          </div>

          {/* Payment Instructions */}
          <div className="bg-white rounded-lg p-6 mb-4">
            <div className="flex items-start space-x-3 mb-4">
              <Timer className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-semibold text-lg mb-2">Ожидание оплаты</h2>
                <p className="text-gray-600">
                  На номер <span className="font-medium">+7 701 521 1545</span> выставлен счет в Kaspi.
                </p>
                <div className="mt-2 font-medium text-orange-500">
                  Осталось времени: {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
              <div className="flex space-x-2">
                <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-sm text-orange-700">
                  Цветы забронированы на 5 минут. Если оплата не поступит в течение этого времени, бронь будет снята автоматически.
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h2 className="font-semibold mb-4">Детали заказа</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Сумма заказа:</span>
                <span className="font-medium">45 000 ₸</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Доставка:</span>
                <span className="font-medium">2 000 ₸</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Итого к оплате:</span>
                  <span>47 000 ₸</span>
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
            <Link
              to="/purchase"
              className="block w-full bg-blue-600 text-white py-3 lg:py-2.5 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
            >
              Вернуться к покупкам
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
