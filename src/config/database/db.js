import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabase.config';
import { schema } from './schema';
import { withErrorHandling } from './utils/error-handler';

// Создаем клиент Supabase
export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Утилиты для работы с базой данных
export const db = {
  // Базовые операции с БД
  select: withErrorHandling(async (table, columns = '*') => {
    const { data, error } = await supabase
      .from(table)
      .select(columns);
    
    if (error) throw error;
    return data;
  }),

  insert: withErrorHandling(async (table, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }),

  update: withErrorHandling(async (table, id, data) => {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }),

  delete: withErrorHandling(async (table, id) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }),

  // Утилиты для работы со схемой
  getColumnName: (table, column) => {
    return schema[table]?.columns[column] || column;
  },

  getTableColumns: (table) => {
    return Object.keys(schema[table]?.columns || {});
  },

  hasColumn: (table, column) => {
    return !!schema[table]?.columns[column];
  }
};

// Экспортируем схему и сервисы
export { schema } from './schema';
export * from './services';
