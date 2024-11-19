import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export const useSupabaseQuery = (queryFn, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { onSuccess, onError, enabled = true } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await queryFn();
      setData(result);
      setError(null);
      onSuccess?.(result);
    } catch (err) {
      setError(err);
      setData(null);
      onError?.(err);
      toast.error(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [queryFn, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    loading,
    refetch
  };
};

// Хук для работы с пагинацией
export const useSupabasePagination = (queryFn, options = {}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(options.pageSize || 10);
  const [total, setTotal] = useState(0);

  const query = useCallback(async () => {
    const { data, count } = await queryFn({
      pagination: { page, pageSize }
    });
    setTotal(count);
    return data;
  }, [queryFn, page, pageSize]);

  const result = useSupabaseQuery(query, options);

  return {
    ...result,
    pagination: {
      page,
      pageSize,
      total,
      setPage,
      setPageSize,
      totalPages: Math.ceil(total / pageSize)
    }
  };
};

// Хук для работы с мутациями (создание, обновление, удаление)
export const useSupabaseMutation = (mutationFn, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(...args);
      options.onSuccess?.(result);
      toast.success(options.successMessage || 'Operation successful');
      return result;
    } catch (err) {
      setError(err);
      options.onError?.(err);
      toast.error(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error
  };
};
