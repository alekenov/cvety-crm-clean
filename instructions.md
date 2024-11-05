# CRM система для цветочного магазина

## О проекте
CRM-система для управления сетью цветочных магазинов с возможностью управления заказами, товарами, складом и клиентами.

## Технологический стек
* **Frontend Framework**: React.js 18
* **State Management**: Redux Toolkit
* **Стилизация**: 
  * Tailwind CSS
  * CSS Modules
* **Иконки**: Lucide React
* **Роутинг**: React Router DOM v6

## Структура проекта
```
src/
├── components/
│   ├── features/          # Компоненты с бизнес-логикой
│   │   └── orders/       # Компоненты для заказов
│   │       ├── OrderCard/
│   │       ├── OrderForm/
│   │       └── OrderList/
│   ├── layout/           # Компоненты разметки
│   │   ├── Header/
│   │   ├── PageLayout/
│   │   ├── SidebarMenu/
│   │   └── TopBar/
│   └── ui/              # Базовые UI компоненты
│       ├── Badge/
│       ├── Button/
│       ├── Card/
│       ├── Input/
│       ├── Modal/
│       └── Select/
├── pages/               # Страницы приложения
│   ├── ClientsPage/
│   ├── Dashboard/
│   ├── InventoryPage/
│   │   └── components/
│   ├── LoginPage/
│   ├── OrdersPage/
│   │   └── components/
│   ├── ProductsPage/
│   └── Settings/
│       └── components/
├── services/           # Сервисы и API
│   └── api/
├── store/             # Redux store
│   ├── clients/
│   ├── orders/
│   └── products/
└── styles/            # Глобальные стили
```

## Компоненты

### UI компоненты (ui)
* **Badge**: Бейджи для статусов и меток
* **Button**: Кнопка с вариантами стилей
* **Card**: Карточка для группировки контента
* **Input**: Поле ввода
* **Modal**: Модальное окно
* **Select**: Выпадающий список

### Компоненты разметки (layout)
* **Header**: Шапка сайта
* **PageLayout**: Общий макет страниц
* **SidebarMenu**: Боковое меню (десктоп)
* **TopBar**: Верхняя панель с профилем

### Страницы (pages)
* **DashboardPage**: Главная страница со статистикой
* **OrdersPage**: Управление заказами
  * OrderProcessing: Обработка заказа
* **ProductsPage**: Управление товарами
* **InventoryPage**: Управление складом
  * StockManagement: Управление товарами
  * OperationHistory: История операций
* **ClientsPage**: База клиентов
* **Settings**: Настройки системы
  * ShopManagement: Управление магазинами
  * EmployeeSettings: Управление сотрудниками

## Store (Redux)
* **clients**: Управление клиентами
* **orders**: Управление заказами
* **products**: Управление товарами

## Services
* **api**: Взаимодействие с бэкендом
  * orders.js: API заказов

## Стилизация
* Использование Tailwind CSS
* CSS Modules для специфичных компонентов
* Единая цветовая схема
* Адаптивный дизайн

## Дальнейшее развитие
1. Авторизация и роли
2. Интеграция с бэкендом
3. Аналитика и отчеты
4. Система уведомлений
5. Интеграция с платежными системами