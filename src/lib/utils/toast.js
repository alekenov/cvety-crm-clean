import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message);
  },
  error: (message) => {
    toast.error(message);
  },
  loading: (message) => {
    return toast.loading(message);
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  promise: async (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Загрузка...',
      success: messages.success || 'Успешно!',
      error: messages.error || 'Произошла ошибка',
    });
  },
};
