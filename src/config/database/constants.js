// Статусы заказов
export const ORDER_STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  DELIVERING: 'delivering',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Статусы оплаты
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  REFUNDED: 'refunded'
};

// Методы оплаты
export const PAYMENT_METHOD = {
  CASH: 'cash',
  CARD: 'card',
  ONLINE: 'online'
};

// Роли сотрудников
export const EMPLOYEE_ROLE = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  FLORIST: 'florist',
  COURIER: 'courier'
};

// Статусы сотрудников
export const EMPLOYEE_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline'
};

// Реакции клиентов
export const CLIENT_REACTION = {
  POSITIVE: 'positive',
  NEUTRAL: 'neutral',
  NEGATIVE: 'negative'
};

// Статусы наличия товаров
export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock'
};
