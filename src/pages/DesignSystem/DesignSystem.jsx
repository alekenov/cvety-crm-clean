import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilterGroup } from '@/components/ui/FilterGroup';
import { H1, H2, Body } from '@/components/ui/Typography';
import { Calendar, Truck, Store, Package, CreditCard, Clock } from 'lucide-react';

const ComponentDemo = ({ title, children }) => {
  return (
    <div className="mb-8">
      <H2 className="mb-4">{title}</H2>
      <Card>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default function DesignSystem() {
  // Состояния для демонстрации
  const [deliveryFilter, setDeliveryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('all');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <H1 className="mb-8">Дизайн система</H1>

        <ComponentDemo title="Фильтры">
          <div className="space-y-8">
            {/* Вертикальные фильтры */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Фильтр доставки */}
              <FilterGroup
                label="Тип доставки"
                value={deliveryFilter}
                onChange={setDeliveryFilter}
                options={[
                  { value: 'all', label: 'Все типы' },
                  { value: 'delivery', label: 'Доставка', icon: <Truck className="w-4 h-4" /> },
                  { value: 'pickup', label: 'Самовывоз', icon: <Store className="w-4 h-4" /> }
                ]}
                orientation="vertical"
              />

              {/* Фильтр даты */}
              <FilterGroup
                label="Дата заказа"
                value={dateFilter}
                onChange={setDateFilter}
                options={[
                  { value: 'all', label: 'Все даты' },
                  { value: 'today', label: 'Сегодня' },
                  { value: 'tomorrow', label: 'Завтра' },
                  { value: 'custom', label: 'Выбрать дату', icon: <Calendar className="w-4 h-4" /> }
                ]}
                orientation="vertical"
              />

              {/* Фильтр статуса */}
              <FilterGroup
                label="Статус заказа"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'processing', label: 'В обработке', icon: <Package className="w-4 h-4" /> },
                  { value: 'paid', label: 'Оплачен', icon: <CreditCard className="w-4 h-4" /> },
                  { value: 'delivered', label: 'Доставлен', icon: <Truck className="w-4 h-4" /> },
                  { value: 'delayed', label: 'Задерживается', icon: <Clock className="w-4 h-4" /> }
                ]}
                multiple={true}
                orientation="vertical"
              />
            </div>

            {/* Горизонтальные фильтры */}
            <div className="space-y-4">
              <Body className="font-medium">Горизонтальные фильтры</Body>
              <FilterGroup
                value={paymentFilter}
                onChange={setPaymentFilter}
                options={[
                  { value: 'all', label: 'Все способы' },
                  { value: 'card', label: 'Картой', icon: <CreditCard className="w-4 h-4" /> },
                  { value: 'cash', label: 'Наличными' },
                  { value: 'transfer', label: 'Перевод' }
                ]}
                orientation="horizontal"
              />
            </div>
          </div>
        </ComponentDemo>

        <ComponentDemo title="Состояния фильтров">
          <div className="space-y-4">
            <Body className="font-medium">Текущие значения:</Body>
            <div className="space-y-2">
              <Body>Доставка: {deliveryFilter}</Body>
              <Body>Дата: {dateFilter}</Body>
              <Body>Статус: {statusFilter.join(', ') || 'не выбран'}</Body>
              <Body>Оплата: {paymentFilter}</Body>
            </div>
          </div>
        </ComponentDemo>
      </div>
    </div>
  );
}
