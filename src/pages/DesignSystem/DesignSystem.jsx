import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { H1, H2, H3, Body, Caption } from '@/components/ui/Typography';
import { 
  Calendar, Truck, Store, Package, CreditCard, Clock, Star, Filter, Box, 
  Plus, Minus, Search, X, MessageCircle, Camera, MapPin, Phone, User, Tag,
  AlertTriangle, Check, ChevronDown, ChevronUp, Settings, Heart
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/Textarea';
import { Switch } from '@/components/ui/forms/Switch';
import { Tooltip } from '@/components/ui/overlays/Tooltip';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Pagination } from '@/components/ui/pagination';
import { SearchBar } from '@/components/ui/search/SearchBar';
import { FilterGroup, FilterButton } from '@/components/ui/filters/FilterGroup';
import DateFilter from '@/components/Filters/DateFilter';
import StatusFilter from '@/components/Filters/StatusFilter';
import { SimpleDataTable, CustomDataTable } from './components/DataTableDemo';

const ComponentDemo = ({ title, children, description }) => {
  return (
    <div className="mb-8">
      <H2 className="mb-2">{title}</H2>
      {description && <Body className="text-gray-600 mb-4">{description}</Body>}
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
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);
  const [switchValue, setSwitchValue] = useState(false);
  const [date, setDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(1);
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <H1 className="mb-8">Компоненты</H1>

        {/* DataTable */}
        <ComponentDemo 
          title="DataTable" 
          description="Универсальный компонент для отображения данных в табличном или карточном виде. Поддерживает поиск, кастомизацию внешнего вида и адаптивную верстку."
        >
          <div className="space-y-8">
            <div>
              <H3 className="mb-4">Простая таблица с колонками</H3>
              <SimpleDataTable />
            </div>

            <div>
              <H3 className="mb-4">Кастомный вид карточек</H3>
              <CustomDataTable />
            </div>
          </div>
        </ComponentDemo>

        {/* Поиск */}
        <ComponentDemo 
          title="Поиск" 
          description="Универсальный компонент поиска с иконкой и кнопкой очистки"
        >
          <div className="max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Поиск..."
            />
          </div>
        </ComponentDemo>

        {/* Фильтры */}
        <ComponentDemo 
          title="Фильтры" 
          description="Набор компонентов для фильтрации данных"
        >
          <div className="space-y-4">
            {/* Фильтр по дате */}
            <DateFilter
              value={dateFilter}
              onChange={setDateFilter}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />

            {/* Фильтр по статусу */}
            <StatusFilter
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
            />

            {/* Пример кастомного фильтра по категориям */}
            <FilterGroup icon={Tag} title="Категории">
              <FilterButton
                active={categoryFilter === 'flowers'}
                onClick={() => setCategoryFilter(categoryFilter === 'flowers' ? null : 'flowers')}
              >
                Цветы
              </FilterButton>
              <FilterButton
                active={categoryFilter === 'bouquets'}
                onClick={() => setCategoryFilter(categoryFilter === 'bouquets' ? null : 'bouquets')}
                variant="success"
              >
                Букеты
              </FilterButton>
              <FilterButton
                active={categoryFilter === 'gifts'}
                onClick={() => setCategoryFilter(categoryFilter === 'gifts' ? null : 'gifts')}
                variant="default"
              >
                Подарки
              </FilterButton>
            </FilterGroup>

            {/* Пример фильтра по цене */}
            <FilterGroup icon={CreditCard} title="Ценовой диапазон">
              <FilterButton
                active={priceFilter === 'low'}
                onClick={() => setPriceFilter(priceFilter === 'low' ? null : 'low')}
              >
                До 5000 ₸
              </FilterButton>
              <FilterButton
                active={priceFilter === 'medium'}
                onClick={() => setPriceFilter(priceFilter === 'medium' ? null : 'medium')}
              >
                5000 - 15000 ₸
              </FilterButton>
              <FilterButton
                active={priceFilter === 'high'}
                onClick={() => setPriceFilter(priceFilter === 'high' ? null : 'high')}
              >
                Более 15000 ₸
              </FilterButton>
            </FilterGroup>

            {/* Пример комбинированных фильтров */}
            <div className="flex flex-wrap gap-4 items-start">
              <FilterGroup icon={Heart} title="Избранное">
                <FilterButton
                  active={true}
                  variant="danger"
                >
                  В избранном
                </FilterButton>
              </FilterGroup>

              <FilterGroup icon={Settings} title="Дополнительно">
                <FilterButton
                  active={true}
                >
                  С фото
                </FilterButton>
                <FilterButton
                  active={false}
                  variant="success"
                >
                  Есть отзыв
                </FilterButton>
              </FilterGroup>
            </div>
          </div>
        </ComponentDemo>

        {/* Остальные компоненты */}
        <ComponentDemo title="Карточка заказа">
          <div className="space-y-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="flex flex-wrap justify-between items-center mb-3">
                  <H3 className="font-bold">#1234</H3>
                  <Badge variant="success">Оплачен</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Caption className="text-gray-500 mb-1">Дата доставки</Caption>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <Body>Сегодня, 15:00-18:00</Body>
                    </div>
                  </div>
                  
                  <div>
                    <Caption className="text-gray-500 mb-1">Способ получения</Caption>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <Body>Доставка</Body>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <Body>Иван Иванов</Body>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <Body>+7 (777) 123-45-67</Body>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <Body>ул. Пушкина, д. 10</Body>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <Camera className="w-4 h-4 text-gray-400" />
                  </div>
                  <Body className="font-bold">15 000 ₸</Body>
                </div>
              </CardContent>
            </Card>
            <Caption className="text-gray-500">
              Используется на страницах: 
              <span className="font-medium">Заказы</span>, 
              <span className="font-medium">Детали заказа</span>
            </Caption>
          </div>
        </ComponentDemo>

        <ComponentDemo title="Фильтры по дате">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Фильтры по дате</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-4 py-2 rounded-full ${dateFilter === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setDateFilter('today')}
              >
                Сегодня
              </button>
              <button 
                className={`px-4 py-2 rounded-full ${dateFilter === 'tomorrow' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setDateFilter('tomorrow')}
              >
                Завтра
              </button>
              <button 
                className={`px-4 py-2 rounded-full ${dateFilter === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setDateFilter('week')}
              >
                Эта неделя
              </button>
              <button 
                className={`px-4 py-2 rounded-full ${dateFilter === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setDateFilter('month')}
              >
                Этот месяц
              </button>
            </div>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на страницах: 
            <span className="font-medium">Заказы</span>, 
            <span className="font-medium">Аналитика</span>, 
            <span className="font-medium">Финансы</span>
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Фильтры по типу">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Фильтры по типу</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${categoryFilter === 'flowers' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setCategoryFilter(categoryFilter === 'flowers' ? null : 'flowers')}
              >
                <Box className="w-4 h-4" /> Цветы
              </button>
              <button 
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${categoryFilter === 'bouquets' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setCategoryFilter(categoryFilter === 'bouquets' ? null : 'bouquets')}
              >
                <Store className="w-4 h-4" /> Букеты
              </button>
              <button 
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${categoryFilter === 'gifts' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setCategoryFilter(categoryFilter === 'gifts' ? null : 'gifts')}
              >
                <Clock className="w-4 h-4" /> Подарки
              </button>
            </div>
          </div>
        </ComponentDemo>

        <ComponentDemo title="Кнопки">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Основная</Button>
              <Button variant="secondary">Вторичная</Button>
              <Button variant="outline">В обводке</Button>
              <Button variant="ghost">Призрачная</Button>
              <Button variant="link">Ссылка</Button>
              <Button variant="primary" size="sm">Маленькая</Button>
              <Button variant="primary" size="lg">Большая</Button>
              <Button variant="primary" disabled>Неактивная</Button>
              <Button variant="primary">
                <Plus className="w-4 h-4 mr-2" />
                С иконкой
              </Button>
            </div>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на всех страницах приложения
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Поля ввода">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <H3>Текстовые поля</H3>
                <Input placeholder="Стандартное поле" />
                <Input placeholder="С иконкой" icon={<Search className="w-4 h-4" />} />
                <Input placeholder="Неактивное" disabled />
                <Input placeholder="С ошибкой" error="Это поле обязательное" />
              </div>
              
              <div className="space-y-2">
                <H3>Выпадающие списки</H3>
                <Select
                  options={[
                    { value: 'option1', label: 'Опция 1' },
                    { value: 'option2', label: 'Опция 2' },
                    { value: 'option3', label: 'Опция 3' },
                  ]}
                  placeholder="Выберите опцию"
                />
              </div>
            </div>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на страницах: 
            <span className="font-medium">Создание заказа</span>,
            <span className="font-medium">Редактирование заказа</span>,
            <span className="font-medium">Настройки</span>
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Статусы и бейджи">
          <div className="space-y-8">
            <div>
              <H3 className="mb-4">Статусы заказов</H3>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded-full bg-gray-500 text-white">
                  Все заказы
                </button>
                <button className="px-4 py-2 rounded-full bg-blue-100 text-blue-700">
                  Новый
                </button>
                <button className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700">
                  В работе
                </button>
                <button className="px-4 py-2 rounded-full bg-green-100 text-green-700">
                  Готов
                </button>
                <button className="px-4 py-2 rounded-full bg-purple-100 text-purple-700">
                  Доставлен
                </button>
                <button className="px-4 py-2 rounded-full bg-red-100 text-red-700">
                  Отменён
                </button>
              </div>
            </div>

            <div>
              <H3 className="mb-4">Информационные бейджи</H3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">VIP клиент</Badge>
                <Badge variant="outline">Новый клиент</Badge>
                <Badge variant="success">Постоянный клиент</Badge>
                <Badge variant="warning">Особые пожелания</Badge>
                <Badge variant="error">Проблемный клиент</Badge>
              </div>
            </div>

            <div>
              <H3 className="mb-4">Метки товаров</H3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Популярное</Badge>
                <Badge variant="outline">Новинка</Badge>
                <Badge variant="success">В наличии</Badge>
                <Badge variant="warning">Заканчивается</Badge>
                <Badge variant="error">Нет в наличии</Badge>
              </div>
            </div>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на страницах: 
            <span className="font-medium">Заказы (статусы)</span>,
            <span className="font-medium">Клиенты (информационные бейджи)</span>,
            <span className="font-medium">Товары (метки товаров)</span>
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Текстовая область">
          <div className="space-y-4">
            <Textarea 
              placeholder="Введите описание..." 
              rows={4}
            />
          </div>
        </ComponentDemo>

        <ComponentDemo title="Переключатели">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Switch 
                checked={switchValue} 
                onCheckedChange={setSwitchValue} 
              />
              <Body>Статус: {switchValue ? 'Включено' : 'Выключено'}</Body>
            </div>
          </div>
        </ComponentDemo>

        <ComponentDemo title="Подсказки">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Tooltip content="Это подсказка!">
                <Button variant="outline">Наведите на меня</Button>
              </Tooltip>
            </div>
          </div>
        </ComponentDemo>

        <ComponentDemo title="Диалоговые окна">
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Открыть диалог</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Заголовок диалога</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>Это содержимое диалогового окна. Здесь может быть любой контент.</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button">
                    Отмена
                  </Button>
                  <Button type="submit">Сохранить</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на страницах: 
            <span className="font-medium">Редактирование заказа</span>,
            <span className="font-medium">Удаление элементов</span>,
            <span className="font-medium">Подтверждение действий</span>
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Календарь">
          <div className="space-y-4">
            <div className="w-fit border rounded-lg bg-white">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </div>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на страницах: 
            <span className="font-medium">Создание заказа</span>,
            <span className="font-medium">Редактирование заказа</span>
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Пагинация">
          <div className="space-y-4">
            <Pagination
              currentPage={currentPage}
              totalPages={5}
              onPageChange={setCurrentPage}
            />
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на страницах: 
            <span className="font-medium">Заказы</span>,
            <span className="font-medium">Клиенты</span>,
            <span className="font-medium">Товары</span>
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Карточки">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6">
                  <H3 className="mb-2">Простая карточка</H3>
                  <Body>Базовый вариант карточки с контентом</Body>
                </CardContent>
              </Card>
              
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <H3 className="mb-2">Акцентная карточка</H3>
                  <Body>Карточка с цветным фоном и рамкой</Body>
                </CardContent>
              </Card>
            </div>
          </div>
        </ComponentDemo>

        <ComponentDemo title="Счетчики и цены">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <H3 className="mb-4">Счетчик количества</H3>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <button 
                    onClick={() => setCount(Math.max(1, count - 1))}
                    className="w-8 h-8 flex items-center justify-center text-red-500"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="mx-4 font-bold">{count}</span>
                  <button 
                    onClick={() => setCount(count + 1)}
                    className="w-8 h-8 flex items-center justify-center text-green-500"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {(count * 5000).toLocaleString()} ₸
                  </div>
                  <div className="text-sm text-gray-500">
                    5000 ₸ / шт
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <H3 className="mb-4">Форматы цен</H3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span>Базовая цена</span>
                  <span className="text-lg font-bold">15 000 ₸</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 text-green-700 rounded-lg">
                  <span>Со скидкой</span>
                  <div className="text-right">
                    <span className="text-lg font-bold">12 000 ₸</span>
                    <span className="text-sm ml-2 line-through text-gray-500">15 000 ₸</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <span>Оптовая цена</span>
                  <div className="text-right">
                    <span className="text-lg font-bold">10 000 ₸</span>
                    <span className="text-sm block">от 10 шт</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на страницах: 
            <span className="font-medium">Создание заказа</span>,
            <span className="font-medium">Корзина</span>
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Выбор даты и времени">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <H3 className="mb-4">Выбор даты доставки</H3>
              <div className="space-y-3">
                <div className="flex overflow-x-auto gap-2">
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg whitespace-nowrap">
                    Сегодня
                  </button>
                  <button className="px-4 py-2 bg-white border rounded-lg whitespace-nowrap">
                    Завтра
                  </button>
                  <button className="px-4 py-2 bg-white border rounded-lg whitespace-nowrap flex items-center">
                    <Calendar size={16} className="mr-1" />
                    Выбрать дату
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button className="p-2 bg-blue-500 text-white rounded-lg text-sm">
                    10:00 - 12:00
                  </button>
                  <button className="p-2 bg-white border rounded-lg text-sm">
                    12:00 - 14:00
                  </button>
                  <button className="p-2 bg-white border rounded-lg text-sm">
                    14:00 - 16:00
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на страницах: 
            <span className="font-medium">Создание заказа</span>
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Формы доставки">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <H3 className="mb-4">Адрес доставки</H3>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input 
                    type="text"
                    placeholder="Улица, дом"
                    className="flex-grow p-3 border rounded-lg"
                  />
                  <button className="p-3 bg-blue-500 text-white rounded-lg">
                    <MapPin size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text"
                    placeholder="Квартира"
                    className="p-3 border rounded-lg"
                  />
                  <input 
                    type="text"
                    placeholder="Подъезд"
                    className="p-3 border rounded-lg"
                  />
                </div>

                <button 
                  className="w-full p-3 bg-gray-100 rounded-lg text-left flex items-center"
                  onClick={() => setShowDemo(!showDemo)}
                >
                  <span className="flex-grow">Комментарий для курьера</span>
                  {showDemo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {showDemo && (
                  <textarea
                    placeholder="Укажите особенности доставки..."
                    className="w-full p-3 border rounded-lg"
                    rows="3"
                  />
                )}
              </div>
            </div>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на страницах: 
            <span className="font-medium">Создание заказа</span>,
            <span className="font-medium">Редактирование заказа</span>
          </Caption>
        </ComponentDemo>

        <ComponentDemo title="Уведомления">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <H3 className="mb-4">Типы уведомлений</H3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertTriangle className="text-red-500 mr-2 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    Не удалось сохранить изменения. Попробуйте позже.
                  </div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <Check className="text-green-500 mr-2 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    Изменения успешно сохранены!
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                  <Search className="text-blue-500 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    Поиск не дал результатов. Попробуйте изменить параметры.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Caption className="text-gray-500 mt-2">
            Используется на всех страницах приложения
          </Caption>
        </ComponentDemo>

      </div>
    </div>
  );
}
