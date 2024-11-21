import React, { useState } from 'react';
import { 
  Plus, Edit2, MessageCircle, Instagram, MapPin, Phone, 
  Map, Clock, Settings, X, Briefcase, Pencil 
} from 'lucide-react';
import { showToast } from '@/lib/utils/toast';

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
        pickup: true,
        delivery: true,
        marketplace: true
      },
      employees: [
        { 
          id: 1, 
          name: "Анна Иванова", 
          role: "Флорист", 
          phone: "+7 (777) 123-45-67"
        }
      ]
    },
    {
      id: 2,
      name: "Достык",
      address: "пр. Достык, 89",
      phone: "+7 (777) 222-22-22",
      whatsapp: "+7 (777) 222-22-23",
      instagram: "@dostyk_flowers",
      workingHours: {
        weekdays: { open: "09:00", close: "21:00" },
        weekend: { open: "10:00", close: "19:00" },
      },
      settings: {
        pickup: true,
        delivery: false,
        marketplace: true
      },
      employees: [
        {
          id: 1,
          name: "Мария Петрова",
          role: "Флорист",
          phone: "+7 (777) 234-56-78"
        }
      ]
    }
  ]);

  // Получаем текущий магазин
  const currentShop = shops.find(s => s.id === selectedShop);

  const handleSaveShop = () => {
    if (!editingShop) return;

    setShops(prevShops =>
      prevShops.map(shop =>
        shop.id === editingShop.id
          ? {
              ...shop,
              name: editingShop.name,
              address: editingShop.address,
              phone: editingShop.phone,
              whatsapp: editingShop.whatsapp,
              instagram: editingShop.instagram,
              workingHours: editingShop.workingHours,
              settings: editingShop.settings,
              employees: editingShop.employees
            }
          : shop
      )
    );

    setEditingShop(null);
    setEditMode(false);
    showToast.success('Магазин успешно обновлен');
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      const updatedShops = shops.map(shop => {
        if (shop.id === selectedShop) {
          let updatedEmployees;
          if (editingEmployee) {
            // Обновляем существующего сотрудника
            updatedEmployees = shop.employees.map(emp => 
              emp.id === employeeData.id ? employeeData : emp
            );
          } else {
            // Проверяем, нет ли сотрудника с таким телефоном
            const existingEmployee = shop.employees.find(emp => emp.phone === employeeData.phone);
            if (existingEmployee) {
              throw new Error('Сотрудник с таким номером телефона уже существует');
            }
            // Добавляем нового сотрудника
            updatedEmployees = [...shop.employees, { ...employeeData, id: Date.now() }];
          }
          
          return {
            ...shop,
            employees: updatedEmployees
          };
        }
        return shop;
      });
      
      setShops(updatedShops);
      setShowEmployeeForm(false);
      setEditingEmployee(null);
      showToast.success(editingEmployee ? 'Данные сотрудника обновлены' : 'Новый сотрудник добавлен');
    } catch (error) {
      showToast.error(error.message || 'Ошибка при сохранении данных сотрудника');
    }
  };

  const handleDeleteEmployee = (employeeId) => {
    try {
      const updatedShops = shops.map(shop => {
        if (shop.id === selectedShop) {
          return {
            ...shop,
            employees: shop.employees.filter(emp => emp.id !== employeeId)
          };
        }
        return shop;
      });
      setShops(updatedShops);
      showToast.success('Сотрудник удален');
    } catch (error) {
      showToast.error('Ошибка при удалении сотрудника');
    }
  };

  const handleEditClick = (shop) => {
    if (editingShop?.id === shop.id) {
      setEditingShop(null);
    } else {
      setEditingShop({ ...shop });
    }
  };

  const handleCancelEditShop = () => {
    setEditingShop(null);
    setEditMode(false);
  };

  const handleUpdateShopInfo = (field, value) => {
    setEditingShop(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateWorkingHours = (type, time, value) => {
    setEditingShop(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [type]: {
          ...prev.workingHours[type],
          [time]: value
        }
      }
    }));
  };

  const handleUpdateShopSettings = (shopId, key) => {
    setEditingShop(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: !prev.settings[key]
      }
    }));
  };

  const SettingItem = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg mb-2 shadow-sm">
      <div className="flex items-center">
        <input 
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="ml-3 text-sm text-gray-700">{label}</span>
      </div>
      <span className={`px-2 py-1 rounded text-sm ${checked ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
        {checked ? 'Активно' : 'Неактивно'}
      </span>
    </div>
  );

  const InfoDisplay = ({ shop }) => (
    <div className="space-y-6">
      {/* Shop Information Section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            {currentShop.name}
          </h2>
          <button
            onClick={() => handleEditClick(currentShop)}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            {editingShop?.id === currentShop.id ? (
              <X className="w-5 h-5" />
            ) : (
              <Pencil className="w-5 h-5" />
            )}
          </button>
        </div>

        {editingShop?.id === currentShop.id ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Название</label>
              <input
                type="text"
                value={editingShop.name}
                onChange={(e) => handleUpdateShopInfo('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Адрес</label>
              <div className="relative">
                <input
                  type="text"
                  value={editingShop.address}
                  onChange={(e) => handleUpdateShopInfo('address', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  onClick={() => {/* TODO: Add map selection functionality */}}
                >
                  <Map size={20} />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Телефон</label>
              <input
                type="text"
                value={editingShop.phone}
                onChange={(e) => handleUpdateShopInfo('phone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
              <input
                type="text"
                value={editingShop.whatsapp}
                onChange={(e) => handleUpdateShopInfo('whatsapp', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instagram</label>
              <input
                type="text"
                value={editingShop.instagram}
                onChange={(e) => handleUpdateShopInfo('instagram', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Рабочие дни</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={editingShop.workingHours.weekdays.open}
                    onChange={(e) => handleUpdateWorkingHours('weekdays', 'open', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={editingShop.workingHours.weekdays.close}
                    onChange={(e) => handleUpdateWorkingHours('weekdays', 'close', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Выходные</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={editingShop.workingHours.weekend.open}
                    onChange={(e) => handleUpdateWorkingHours('weekend', 'open', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={editingShop.workingHours.weekend.close}
                    onChange={(e) => handleUpdateWorkingHours('weekend', 'close', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4 mt-4">
              <h3 className="font-medium text-gray-900">Настройки магазина</h3>
              <div className="space-y-2">
                <SettingItem
                  label="Самовывоз"
                  checked={editingShop.settings.pickup}
                  onChange={() => handleUpdateShopSettings(editingShop.id, 'pickup')}
                />
                <SettingItem
                  label="Доставка"
                  checked={editingShop.settings.delivery}
                  onChange={() => handleUpdateShopSettings(editingShop.id, 'delivery')}
                />
                <SettingItem
                  label="Продажа на Cvety.kz"
                  checked={editingShop.settings.marketplace}
                  onChange={() => handleUpdateShopSettings(editingShop.id, 'marketplace')}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleSaveShop}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Сохранить
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center">
              <MapPin size={16} className="text-gray-500 mr-2" />
              <span>{currentShop.address}</span>
            </div>
            <div className="flex items-center">
              <Phone size={16} className="text-gray-500 mr-2" />
              <span>{currentShop.phone}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle size={16} className="text-gray-500 mr-2" />
              <span>{currentShop.whatsapp}</span>
            </div>
            <div className="flex items-center">
              <Instagram size={16} className="text-gray-500 mr-2" />
              <span>{currentShop.instagram}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="text-gray-500 mr-2" />
              <span>
                Рабочие дни: {currentShop.workingHours.weekdays.open} - {currentShop.workingHours.weekdays.close}
              </span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="text-gray-500 mr-2" />
              <span>
                Выходные: {currentShop.workingHours.weekend.open} - {currentShop.workingHours.weekend.close}
              </span>
            </div>

            <div className="border-t pt-3 mt-3">
              <div className="space-y-2">
                <div className="flex items-center text-sm justify-between">
                  <span className={currentShop.settings.pickup ? 'text-gray-700' : 'text-gray-400'}>
                    {currentShop.settings.pickup ? '✓' : '•'} Самовывоз
                  </span>
                  <span className={`px-2 py-1 rounded ${currentShop.settings.pickup ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    {currentShop.settings.pickup ? 'Активно' : 'Неактивно'}
                  </span>
                </div>
                <div className="flex items-center text-sm justify-between">
                  <span className={currentShop.settings.delivery ? 'text-gray-700' : 'text-gray-400'}>
                    {currentShop.settings.delivery ? '✓' : '•'} Доставка
                  </span>
                  <span className={`px-2 py-1 rounded ${currentShop.settings.delivery ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    {currentShop.settings.delivery ? 'Активно' : 'Неактивно'}
                  </span>
                </div>
                <div className="flex items-center text-sm justify-between">
                  <span className={currentShop.settings.marketplace ? 'text-gray-700' : 'text-gray-400'}>
                    {currentShop.settings.marketplace ? '✓' : '•'} Продажа на Cvety.kz
                  </span>
                  <span className={`px-2 py-1 rounded ${currentShop.settings.marketplace ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                    {currentShop.settings.marketplace ? 'Активно' : 'Неактивно'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Сотрудники */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Сотрудники</h3>
          <button
            onClick={() => setShowEmployeeForm(true)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <Plus size={20} />
            <span>Добавить</span>
          </button>
        </div>

        <div className="space-y-4">
          {shop.employees.map((employee) => (
            <div key={employee.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <h4 className="font-medium">{employee.name}</h4>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center">
                      <Briefcase size={14} className="mr-1" />
                      <span>{employee.role}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={14} className="mr-1" />
                      <span>{employee.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingEmployee(employee);
                    setShowEmployeeForm(true);
                  }}
                  className="p-2 text-blue-600 hover:text-blue-700 rounded-full hover:bg-blue-50"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const EmployeeForm = ({ employee, onCancel }) => {
    const [formData, setFormData] = useState(
      employee || {
        name: '',
        role: 'Флорист',
        phone: ''
      }
    );

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.name || !formData.phone) {
        showToast.error('Заполните обязательные поля');
        return;
      }
      try {
        await handleSaveEmployee(formData);
      } catch (error) {
        showToast.error('Ошибка при сохранении данных сотрудника');
      }
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {employee ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Управление магазином</h2>
        <div className="flex space-x-2">
          {shops.map((shop) => (
            <button
              key={shop.id}
              onClick={() => setSelectedShop(shop.id)}
              className={`px-4 py-2 rounded-lg ${
                selectedShop === shop.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {shop.name}
            </button>
          ))}
        </div>
      </div>

      {currentShop && (
        <>
          <InfoDisplay shop={currentShop} />
          {showEmployeeForm && (
            <EmployeeForm
              employee={editingEmployee}
              onCancel={() => {
                setShowEmployeeForm(false);
                setEditingEmployee(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ShopManagement;