import React, { useState } from 'react';
import { 
  Plus, Edit2, MessageCircle, Instagram, MapPin, Phone, 
  Map, Clock, Settings, X, Briefcase, Pencil 
} from 'lucide-react';
import { showToast } from '@/lib/utils/toast';

// Custom confirmation modal component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">{title}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{message}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={onConfirm}
            >
              Удалить
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={onClose}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function ShopManagement() {
  const [selectedShop, setSelectedShop] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [newShopMode, setNewShopMode] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

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

  const currentShop = shops.find(s => s.id === selectedShop);

  const handleAddNewShop = () => {
    const newShop = {
      id: Math.max(0, ...shops.map(s => s.id)) + 1,
      name: "Новый магазин",
      address: "",
      phone: "",
      whatsapp: "",
      instagram: "",
      workingHours: {
        weekdays: { open: "09:00", close: "20:00" },
        weekend: { open: "10:00", close: "18:00" },
      },
      settings: {
        pickup: true,
        delivery: true,
        marketplace: true
      },
      employees: []
    };

    setShops(prev => [...prev, newShop]);
    setSelectedShop(newShop.id);
    setEditingShop(newShop);
    setNewShopMode(false);
    showToast.success('Новый магазин создан');
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        handleUpdateEmployee(editingEmployee.id, employeeData);
      } else {
        handleAddEmployee(employeeData);
      }
      setShowEmployeeForm(false);
      setEditingEmployee(null);
    } catch (error) {
      showToast.error('Ошибка при сохранении данных сотрудника');
    }
  };

  const handleDeleteEmployee = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteEmployee = () => {
    setShops(prevShops =>
      prevShops.map(shop =>
        shop.id === selectedShop
          ? {
              ...shop,
              employees: shop.employees.filter(emp => emp.id !== employeeToDelete)
            }
          : shop
      )
    );
    setShowDeleteConfirm(false);
    setEmployeeToDelete(null);
    showToast.success('Сотрудник удален');
  };

  const handleAddEmployee = (employeeData) => {
    if (!employeeData.name || !employeeData.phone || !employeeData.role) {
      showToast.error('Заполните все обязательные поля');
      return;
    }

    setShops(prevShops =>
      prevShops.map(shop =>
        shop.id === selectedShop
          ? {
              ...shop,
              employees: [
                ...shop.employees,
                {
                  id: Math.max(0, ...shop.employees.map(e => e.id)) + 1,
                  ...employeeData
                }
              ]
            }
          : shop
      )
    );
    showToast.success('Сотрудник добавлен');
  };

  const handleUpdateEmployee = (employeeId, employeeData) => {
    if (!employeeData.name || !employeeData.phone || !employeeData.role) {
      showToast.error('Заполните все обязательные поля');
      return;
    }

    setShops(prevShops =>
      prevShops.map(shop =>
        shop.id === selectedShop
          ? {
              ...shop,
              employees: shop.employees.map(emp =>
                emp.id === employeeId
                  ? { ...emp, ...employeeData }
                  : emp
              )
            }
          : shop
      )
    );
    showToast.success('Данные сотрудника обновлены');
  };

  const handleUpdateShopInfo = (field, value) => {
    setEditingShop(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateWorkingHours = (type, field, value) => {
    setEditingShop(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [type]: {
          ...prev.workingHours[type],
          [field]: value
        }
      }
    }));
  };

  const handleUpdateShopSettings = (shopId, setting) => {
    setEditingShop(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [setting]: !prev.settings[setting]
      }
    }));
  };

  const SettingItem = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-2">
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span className="ml-2 text-sm text-gray-700">{label}</span>
      </label>
    </div>
  );

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

  const InfoDisplay = ({ shop }) => (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          {shop.name}
        </h2>
        <button
          onClick={() => handleEditClick(shop)}
          className="p-2 text-gray-400 hover:text-gray-500"
          aria-label={editingShop?.id === shop.id ? "Закрыть редактирование" : "Редактировать магазин"}
        >
          {editingShop?.id === shop.id ? (
            <X className="w-5 h-5" />
          ) : (
            <Pencil className="w-5 h-5" />
          )}
        </button>
      </div>

      {editingShop?.id === shop.id ? (
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
            <span>{shop.address}</span>
          </div>
          <div className="flex items-center">
            <Phone size={16} className="text-gray-500 mr-2" />
            <span>{shop.phone}</span>
          </div>
          <div className="flex items-center">
            <MessageCircle size={16} className="text-gray-500 mr-2" />
            <span>{shop.whatsapp}</span>
          </div>
          <div className="flex items-center">
            <Instagram size={16} className="text-gray-500 mr-2" />
            <span>{shop.instagram}</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="text-gray-500 mr-2" />
            <span>
              Рабочие дни: {shop.workingHours.weekdays.open} - {shop.workingHours.weekdays.close}
            </span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="text-gray-500 mr-2" />
            <span>
              Выходные: {shop.workingHours.weekend.open} - {shop.workingHours.weekend.close}
            </span>
          </div>

          <div className="border-t pt-3 mt-3">
            <div className="space-y-2">
              <div className="flex items-center text-sm justify-between">
                <span className={shop.settings.pickup ? 'text-gray-700' : 'text-gray-400'}>
                  {shop.settings.pickup ? '✓' : '•'} Самовывоз
                </span>
                <span className={`px-2 py-1 rounded ${shop.settings.pickup ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                  {shop.settings.pickup ? 'Активно' : 'Неактивно'}
                </span>
              </div>
              <div className="flex items-center text-sm justify-between">
                <span className={shop.settings.delivery ? 'text-gray-700' : 'text-gray-400'}>
                  {shop.settings.delivery ? '✓' : '•'} Доставка
                </span>
                <span className={`px-2 py-1 rounded ${shop.settings.delivery ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                  {shop.settings.delivery ? 'Активно' : 'Неактивно'}
                </span>
              </div>
              <div className="flex items-center text-sm justify-between">
                <span className={shop.settings.marketplace ? 'text-gray-700' : 'text-gray-400'}>
                  {shop.settings.marketplace ? '✓' : '•'} Продажа на Cvety.kz
                </span>
                <span className={`px-2 py-1 rounded ${shop.settings.marketplace ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
                  {shop.settings.marketplace ? 'Активно' : 'Неактивно'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const EmployeeForm = ({ employee, onCancel }) => {
    const [formData, setFormData] = useState(
      employee || {
        name: '',
        role: '',
        phone: ''
      }
    );

    const handleSubmit = (e) => {
      e.preventDefault();
      if (employee) {
        handleUpdateEmployee(employee.id, formData);
      } else {
        handleAddEmployee(formData);
      }
      onCancel();
    };

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-medium mb-4">
            {employee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ФИО
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Должность
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Телефон
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Управление магазинами</h1>
            <button
              onClick={handleAddNewShop}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Добавить магазин
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Shop List */}
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Список магазинов</h2>
                <div className="space-y-2">
                  {shops.map((shop) => (
                    <button
                      key={shop.id}
                      onClick={() => setSelectedShop(shop.id)}
                      className={`w-full text-left px-4 py-2 rounded-md ${
                        selectedShop === shop.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {shop.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Shop Details */}
          <div className="col-span-1 md:col-span-3">
            {currentShop && (
              <div className="space-y-6">
                <InfoDisplay shop={currentShop} />

                {/* Employees Section */}
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
                    {currentShop.employees.map((employee) => (
                      <div
                        key={employee.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
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
            )}
          </div>
        </div>
      </div>

      {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          onCancel={() => {
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (employeeToDelete) {
            confirmDeleteEmployee();
            setShowDeleteConfirm(false);
            setEmployeeToDelete(null);
          }
        }}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить этого сотрудника?"
      />
    </div>
  );
}

export default ShopManagement;