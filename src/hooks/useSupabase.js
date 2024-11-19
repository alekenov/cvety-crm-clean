import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabase = (table, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      let query = supabase.from(table).select(options.select || '*');

      // Добавляем фильтры если они есть
      if (options.filters) {
        options.filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value);
        });
      }

      // Добавляем сортировку
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { 
          ascending: options.orderBy.ascending 
        });
      }

      const { data: result, error } = await query;
      
      if (error) throw error;
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const insertData = async (newData) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(newData)
        .select();

      if (error) throw error;
      
      setData(prev => [...prev, ...result]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateData = async (id, updates) => {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      setData(prev => prev.map(item => item.id === id ? result[0] : item));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteData = async (id) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(options)]);

  return {
    data,
    loading,
    error,
    fetchData,
    insertData,
    updateData,
    deleteData
  };
}; 