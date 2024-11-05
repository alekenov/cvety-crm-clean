import React, { useState } from 'react';
import { 
  Plus, Edit2, MessageCircle, Instagram, MapPin, Phone, 
  Map, Clock, Settings, X, Briefcase 
} from 'lucide-react';

function ShopManagement() {
  const [selectedShop, setSelectedShop] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [newShopMode, setNewShopMode] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  const [shops, setShops] = useState([
    { 
      id: 1, 
      name: "Абая", 
      address: "ул. Абая, 10", 
      phone: "+7 (777) 111-11-11",
      whatsapp: "+7 (777) 111-11-12",
      instagram: "@abay_flowers",
      workingHours: {
        weekdays: { open: "09:00", close: "20:00" },
        weekend: { open: "10:00", close: "18:00" },
      },
      settings: {
        pickupOnly: false,
        deliveryOnly: false,
        isActive: true
      },
      employees: [
        { 
          id: 1, 
          name: "Анна Иванова", 
          role: "Флорист", 
          phone: "+7 (777) 123-45-67",
          schedule: "2/2",
          salary: "150000"
        },
        { 
          id: 2, 
          name: "Петр Сидоров", 
          role: "Курьер", 
          phone: "+7 (777) 234-56-78",
          schedule: "5/2",
          salary: "120000"
        }
      ]
    },
    { 
      id: 2, 
      name: "ТЦ Мега", 
      address: "пр. Сейфуллина, 500", 
      phone: "+7 (777) 222-22-22",
      whatsapp: "+7 (777) 222-22-23",
      instagram: "@mega_flowers",
      workingHours: {
        weekdays: { open: "10:00", close: "22:00" },
        weekend: { open: "10:00", close: "22:00" },
      },
      settings: {
        pickupOnly: false,
        deliveryOnly: false,
        isActive: true
      },
      employees: [
        { 
          id: 3, 
          name: "Елена Смирнова", 
          role: "Менеджер", 
          phone: "+7 (777) 345-67-89",
          schedule: "5/2",
          salary: "200000"
        },
        { 
          id: 4, 
          name: "Алексей Петров", 
          role: "Флорист", 
          phone: "+7 (777) 456-78-90",
          schedule: "2/2",
          salary: "150000"
        },
        { 
          id: 5, 
          name: "Дмитрий Иванов", 
          role: "Курьер", 
          phone: "+7 (777) 567-89-01",
          schedule: "6/1",
          salary: "120000"
        }
      ]
    }
  ]);

  // Получаем текущий магазин
  const currentShop = shops.find(s => s.id === selectedShop);

  // Функции управления состоянием
  const handleNewShopStart = () => {
    setEditingShop({
      id: Date.now(),
      name: '',
      address: '',
      phone: '',
      whatsapp: '',
      instagram: '',
      workingHours: {
        weekdays: { open: '09:00', close: '20:00' },
        weekend: { open: '10:00', close: '18:00' }
      }
    });
    setNewShopMode(true);
  };

  const handleEditStart = () => {
    setEditingShop(shops.find(s => s.id === selectedShop));
    setEditMode(true);
  };

  const handleAddEmployee = (newEmployee) => {
    const updatedShops = shops.map(shop => {
      if (shop.id === selectedShop) {
        return {
          ...shop,
          employees: [...shop.employees, { ...newEmployee, id: Date.now() }]
        };
      }
      return shop;
    });
    setShops(updatedShops);
    setShowEmployeeForm(false);
  };

  const handleEditEmployee = (updatedEmployee) => {
    const updatedShops = shops.map(shop => {
      if (shop.id === selectedShop) {
        return {
          ...shop,
          employees: shop.employees.map(emp => 
            emp.id === updatedEmployee.id ? updatedEmployee : emp
          )
        };
      }
      return shop;
    });
    setShops(updatedShops);
    setEditingEmployee(null);
  };

  // Обновим компонент EditForm
  const EditForm = ({ shop, isDesktop = false }) => (
    <div className="space-y-6">
      <div className={`space-y-3 ${isDesktop ? 'grid grid-cols-2 gap-4' : ''}`}>
        <div>
          <label className="text-sm text-gray-600 block mb-1">Название магазина</label>
          <input
            type="text"
            defaultValue={shop.name}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Адрес</label>
          <div className="flex gap-2">
            <input
              type="text"
              defaultValue={shop.address}
              className="flex-grow p-2 border rounded"
            />
            <button className="p-2 bg-blue-50 text-blue-500 rounded">
              <Map size={20} />
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Телефон</label>
          <input
            type="tel"
            defaultValue={shop.phone}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">WhatsApp</label>
          <input
            type="tel"
            defaultValue={shop.whatsapp}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Instagram</label>
          <input
            type="text"
            defaultValue={shop.instagram}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm text-gray-600 block mb-2">Время работы</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm mb-1">Будни</p>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  defaultValue={shop.workingHours.weekdays.open}
                  className="p-2 border rounded"
                />
                <span>—</span>
                <input
                  type="time"
                  defaultValue={shop.workingHours.weekdays.close}
                  className="p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <p className="text-sm mb-1">Выходные</p>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  defaultValue={shop.workingHours.weekend.open}
                  className="p-2 border rounded"
                />
                <span>—</span>
                <input
                  type="time"
                  defaultValue={shop.workingHours.weekend.close}
                  className="p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium text-gray-900 mb-4">Настройки магазина</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Только самовывоз</span>
            <input
              type="checkbox"
              checked={shop.settings.pickupOnly}
              onChange={(e) => {
                const updatedShop = {
                  ...shop,
                  settings: {
                    ...shop.settings,
                    pickupOnly: e.target.checked,
                    deliveryOnly: e.target.checked ? false : shop.settings.deliveryOnly
                  }
                };
                setEditingShop(updatedShop);
              }}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Только доставка</span>
            <input
              type="checkbox"
              checked={shop.settings.deliveryOnly}
              onChange={(e) => {
                const updatedShop = {
                  ...shop,
                  settings: {
                    ...shop.settings,
                    deliveryOnly: e.target.checked,
                    pickupOnly: e.target.checked ? false : shop.settings.pickupOnly
                  }
                };
                setEditingShop(updatedShop);
              }}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Магазин активен</span>
            <input
              type="checkbox"
              checked={shop.settings.isActive}
              onChange={(e) => {
                const updatedShop = {
                  ...shop,
                  settings: {
                    ...shop.settings,
                    isActive: e.target.checked
                  }
                };
                setEditingShop(updatedShop);
              }}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  // Обновим отображение информации в десктопной версии
  const InfoDisplay = ({ shop }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-gray-900">{shop.name}</h3>
          <p className="text-sm text-gray-500 mt-1">Название магазина</p>
        </div>

        <div>
          <p className="flex items-center text-gray-900">
            <MapPin size={18} className="mr-2" />
            {shop.address}
          </p>
          <p className="text-sm text-gray-500 mt-1">Адрес</p>
        </div>

        <div>
          <p className="flex items-center text-gray-900">
            <Phone size={18} className="mr-2" />
            {shop.phone}
          </p>
          <p className="text-sm text-gray-500 mt-1">Телефон</p>
        </div>

        <div>
          <p className="flex items-center text-gray-900">
            <MessageCircle size={18} className="mr-2" />
            {shop.whatsapp}
          </p>
          <p className="text-sm text-gray-500 mt-1">WhatsApp</p>
        </div>

        <div>
          <p className="flex items-center text-gray-900">
            <Instagram size={18} className="mr-2" />
            {shop.instagram}
          </p>
          <p className="text-sm text-gray-500 mt-1">Instagram</p>
        </div>

        <div>
          <p className="flex items-center text-gray-900">
            <Clock size={18} className="mr-2" />
            {`${shop.workingHours.weekdays.open}-${shop.workingHours.weekdays.close}`}
          </p>
          <p className="text-sm text-gray-500 mt-1">Будни</p>
        </div>

        <div>
          <p className="flex items-center text-gray-900">
            <Clock size={18} className="mr-2" />
            {`${shop.workingHours.weekend.open}-${shop.workingHours.weekend.close}`}
          </p>
          <p className="text-sm text-gray-500 mt-1">Выходные</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium text-gray-900 mb-4">Настройки магазина</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Только самовывоз</span>
            <input
              type="checkbox"
              checked={shop.settings.pickupOnly}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Только доставка</span>
            <input
              type="checkbox"
              checked={shop.settings.deliveryOnly}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-gray-700">Магазин активен</span>
            <input
              type="checkbox"
              checked={shop.settings.isActive}
              className="form-checkbox h-5 w-5 text-blue-500"
            />
          </label>
        </div>
      </div>
    </div>
  );

  // Мобилная версия
  const MobileView = () => (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen sm:hidden">
      <div className="bg-white p-4 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-semibold flex items-center">
          <Settings className="text-blue-500 mr-2" size={20} />
          Управление магазинами
        </h1>
        {!editMode && !newShopMode && (
          <button
            onClick={handleNewShopStart}
            className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {shops.map((shop) => (
            <button
              key={shop.id}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedShop === shop.id && !newShopMode 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => !editMode && !newShopMode && setSelectedShop(shop.id)}
            >
              {shop.name}
            </button>
          ))}
        </div>

        {/* Остальной контент мобильной версии */}
        {/* ... */}
      </div>
    </div>
  );

  // Десктопная версия
  const DesktopView = () => (
    <div className="hidden sm:block min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Верхняя панель */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Управление магазинами</h1>
              </div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Добавить магазин
              </button>
            </div>
          </div>

          <div className="px-4 pb-4 flex items-center space-x-2">
            {shops.map((shop) => (
              <button
                key={shop.id}
                className={`px-3 py-1.5 rounded-full text-sm ${
                  selectedShop === shop.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedShop(shop.id)}
              >
                {shop.name}
              </button>
            ))}
          </div>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-3 gap-6">
          {/* Информация о магазине */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-semibold">Информация о магазине</h2>
              {!isEditing ? (
                <button 
                  onClick={handleEditStart}
                  className="p-2 bg-blue-50 text-blue-500 rounded-lg"
                >
                  <Edit2 size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Сохраить
                </button>
              )}
            </div>
            
            {isEditing ? (
              <EditForm shop={currentShop} isDesktop={true} />
            ) : (
              <InfoDisplay shop={currentShop} />
            )}
          </div>

          {/* Сотрудники */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">Сотрудники ({currentShop.employees.length})</h2>
                <button
                  onClick={() => setShowEmployeeForm(true)}
                  className="p-2 bg-green-50 text-green-500 rounded-lg hover:bg-green-100"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                {currentShop.employees.map(employee => (
                  <div key={employee.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Briefcase size={14} className="mr-1" />
                        {employee.role}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Phone size={14} className="mr-1" />
                        {employee.phone}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setEditingEmployee(employee);
                        setShowEmployeeForm(true);
                      }}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Обновленный компонент формы сотрудника
  const EmployeeForm = ({ employee, onSave, onCancel }) => {
    const [formData, setFormData] = useState(
      employee || {
        name: '',
        role: 'Флорист',
        phone: '',
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {employee ? 'Редактировать сотрудника' : 'Новый сотрудник'}
            </h3>
            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">ФИО</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="Введите ФИО сотрудника"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Должность</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="Флорист">Флорист</option>
                <option value="Курьер">Курьер</option>
                <option value="Менеджер">Менеджер</option>
                <option value="Администратор">Администратор</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Телефон</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-2 border rounded"
                placeholder="+7 (___) ___-__-__"
                required
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {employee ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Добавим модальное окно формы
  {(showEmployeeForm) && (
    <EmployeeForm
      employee={editingEmployee}
      onSave={(employee) => {
        if (editingEmployee) {
          handleEditEmployee(employee);
        } else {
          handleAddEmployee(employee);
        }
        setShowEmployeeForm(false);
        setEditingEmployee(null);
      }}
      onCancel={() => {
        setShowEmployeeForm(false);
        setEditingEmployee(null);
      }}
    />
  )}

  return (
    <>
      <MobileView />
      <DesktopView />
      {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSave={(employee) => {
            if (editingEmployee) {
              handleEditEmployee(employee);
            } else {
              handleAddEmployee(employee);
            }
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
          onCancel={() => {
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </>
  );
}

export default ShopManagement; 