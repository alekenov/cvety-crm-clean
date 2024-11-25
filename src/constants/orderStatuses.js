export const ORDER_STATUS = {
  NEW: 'NEW',                       // Новый
  ACCEPTED: 'ACCEPTED',             // Принят
  IN_PROGRESS: 'IN_PROGRESS',       // В работе
  ASSEMBLED: 'ASSEMBLED',           // Собран
  PHOTO_SENT: 'PHOTO_SENT',        // Фото отправлено
  AWAITING_DELIVERY: 'AWAITING_DELIVERY', // Ожидает доставку
  YANDEX_COURIER: 'YANDEX_COURIER', // Курьер Яндекс
  OWN_COURIER: 'OWN_COURIER',       // Свой курьер
  DELIVERING: 'DELIVERING',         // Доставляется
  DELIVERED: 'DELIVERED',           // Доставлен
  PICKUP: 'PICKUP',                 // Самовывоз
  READY_FOR_PICKUP: 'READY_FOR_PICKUP', // Готов к выдаче
  PICKED_UP: 'PICKED_UP',           // Выдан
  DELIVERY_PROBLEM: 'DELIVERY_PROBLEM', // Проблема доставки
  RETURNED: 'RETURNED',             // Возврат
  CANCELLED: 'CANCELLED'            // Отменен
};

export const getStatusLabel = (status) => {
  const labels = {
    [ORDER_STATUS.NEW]: 'Новый',
    [ORDER_STATUS.ACCEPTED]: 'Принят',
    [ORDER_STATUS.IN_PROGRESS]: 'В работе',
    [ORDER_STATUS.ASSEMBLED]: 'Собран',
    [ORDER_STATUS.PHOTO_SENT]: 'Фото отправлено',
    [ORDER_STATUS.AWAITING_DELIVERY]: 'Ожидает доставку',
    [ORDER_STATUS.YANDEX_COURIER]: 'Курьер Яндекс',
    [ORDER_STATUS.OWN_COURIER]: 'Свой курьер',
    [ORDER_STATUS.DELIVERING]: 'Доставляется',
    [ORDER_STATUS.DELIVERED]: 'Доставлен',
    [ORDER_STATUS.PICKUP]: 'Самовывоз',
    [ORDER_STATUS.READY_FOR_PICKUP]: 'Готов к выдаче',
    [ORDER_STATUS.PICKED_UP]: 'Выдан',
    [ORDER_STATUS.DELIVERY_PROBLEM]: 'Проблема доставки',
    [ORDER_STATUS.RETURNED]: 'Возврат',
    [ORDER_STATUS.CANCELLED]: 'Отменен'
  };
  return labels[status] || status;
};

export const getNextStatuses = (currentStatus) => {
  const transitions = {
    [ORDER_STATUS.NEW]: [ORDER_STATUS.ACCEPTED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.ACCEPTED]: [ORDER_STATUS.IN_PROGRESS],
    [ORDER_STATUS.IN_PROGRESS]: [ORDER_STATUS.ASSEMBLED],
    [ORDER_STATUS.ASSEMBLED]: [ORDER_STATUS.PHOTO_SENT],
    [ORDER_STATUS.PHOTO_SENT]: [
      ORDER_STATUS.IN_PROGRESS,     // Клиент просит переделать
      ORDER_STATUS.RETURNED,        // Клиент отказался
      ORDER_STATUS.AWAITING_DELIVERY, // Клиент одобрил
      ORDER_STATUS.PICKUP           // Клиент заберет сам
    ],
    [ORDER_STATUS.AWAITING_DELIVERY]: [
      ORDER_STATUS.YANDEX_COURIER,
      ORDER_STATUS.OWN_COURIER
    ],
    [ORDER_STATUS.YANDEX_COURIER]: [ORDER_STATUS.DELIVERING],
    [ORDER_STATUS.OWN_COURIER]: [ORDER_STATUS.DELIVERING],
    [ORDER_STATUS.DELIVERING]: [
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.DELIVERY_PROBLEM
    ],
    [ORDER_STATUS.PICKUP]: [ORDER_STATUS.READY_FOR_PICKUP],
    [ORDER_STATUS.READY_FOR_PICKUP]: [ORDER_STATUS.PICKED_UP],
    [ORDER_STATUS.DELIVERY_PROBLEM]: [ORDER_STATUS.DELIVERING]
  };
  return transitions[currentStatus] || [];
};

export const isFinalStatus = (status) => {
  return [
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.PICKED_UP,
    ORDER_STATUS.RETURNED,
    ORDER_STATUS.CANCELLED
  ].includes(status);
};
