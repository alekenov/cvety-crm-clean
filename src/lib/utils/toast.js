import toast from 'react-hot-toast';

// Создаем объект с методами для разных типов уведомлений
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  default: (message) => toast(message),
  dismiss: (toastId) => toast.dismiss(toastId),
  promise: (promise, messages) => toast.promise(promise, messages)
};

// Для обратной совместимости
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};
