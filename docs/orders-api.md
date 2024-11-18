# API Заказов

## Базовая информация
- **Базовый URL**: `https://copywriter.kz/local/api`
- **Авторизация**: Bearer Token
- **Token**: `ABE7142D-D8AB-76AF-8D6C-2C4FAEA9B144`

## Структура данных

### Заказ (Order)
```typescript
interface Order {
    number: string;         // Номер заказа
    status: OrderStatus;    // Статус заказа
    client: string;         // Телефон клиента
    address: string;        // Адрес доставки
    time: string;          // Время доставки
    totalPrice: string;    // Общая сумма
    shop?: string;         // Магазин (опционально)
    florist?: string;      // Флорист (опционально)
    items: OrderItem[];    // Состав заказа
    urgent?: boolean;      // Срочный заказ
    clientComment?: string; // Комментарий клиента
    clientReaction?: 'positive' | 'negative'; // Реакция клиента
    clientReactionComment?: string;  // Комментарий к реакции
    reassemblyRequested?: boolean;   // Требуется пересборка
    deliveryProblem?: string;        // Проблема с доставкой
}

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

type OrderStatus = 
    | 'new'           // Новый заказ
    | 'processing'    // В обработке
    | 'assembling'    // Сборка
    | 'delivering'    // Доставляется
    | 'completed'     // Выполнен
    | 'cancelled'     // Отменён
```

## Методы API

### 1. Получение списка заказов
`GET /orders`

**Параметры запроса:**
- `status` (опционально) - фильтр по статусу
- `date` (опционально) - фильтр по дате (формат: YYYY-MM-DD)
- `page` - номер страницы (по умолчанию: 1)
- `limit` - количество заказов на странице (по умолчанию: 20)

**Пример ответа:**
```json
{
    "orders": [
        {
            "number": "ORD-2024-001",
            "status": "new",
            "client": "+7777777777",
            // ... остальные поля заказа
        }
    ],
    "total": 100,
    "page": 1,
    "pages": 5
}
```

### 2. Получение заказа по номеру
`GET /orders/{number}`

**Ответ:** объект Order

### 3. Создание заказа
`POST /orders`

**Тело запроса:** объект Order (без номера)

**Ответ:** созданный объект Order

### 4. Обновление статуса заказа
`PATCH /orders/{number}/status`

**Тело запроса:**
```json
{
    "status": OrderStatus,
    "comment?: string
}
```

### 5. Обновление информации о доставке
`PATCH /orders/{number}/delivery`

**Тело запроса:**
```json
{
    "deliveryProblem?: string,
    "time?: string"
}
```

### 6. Добавление реакции клиента
`POST /orders/{number}/reaction`

**Тело запроса:**
```json
{
    "reaction": "positive" | "negative",
    "comment?: string"
}
```

### 7. Запрос на пересборку
`POST /orders/{number}/reassembly`

**Тело запроса:**
```json
{
    "reason: string"
}
```

## Коды ответов
- 200 - Успешное выполнение
- 400 - Ошибка в параметрах запроса
- 401 - Ошибка авторизации
- 404 - Заказ не найден
- 500 - Внутренняя ошибка сервера




