import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './supabase.config';

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
  // Получить название колонки из схемы
  getColumnName: (table, column) => {
    return supabaseConfig.schema[table]?.columns[column] || column;
  },

  // Получить все колонки таблицы
  getTableColumns: (table) => {
    return Object.values(supabaseConfig.schema[table]?.columns || {});
  },

  // Проверить существование колонки
  hasColumn: (table, column) => {
    return !!supabaseConfig.schema[table]?.columns[column];
  },

  // Базовые операции с БД
  async select(table, columns = '*') {
    try {
      console.log(`Selecting from ${table}:`, columns);
      const { data, error } = await supabase
        .from(supabaseConfig.schema[table].name)
        .select(columns);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Error selecting from ${table}:`, error);
      throw error;
    }
  },

  async insert(table, data) {
    try {
      console.log(`Inserting into ${table}:`, data);
      const { data: result, error } = await supabase
        .from(supabaseConfig.schema[table].name)
        .insert(data)
        .select();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }
  },

  async update(table, id, data) {
    try {
      console.log(`Updating ${table} with id ${id}:`, data);
      const { data: result, error } = await supabase
        .from(supabaseConfig.schema[table].name)
        .update(data)
        .eq('id', id)
        .select();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }
  },

  async delete(table, id) {
    try {
      console.log(`Deleting from ${table} with id ${id}`);
      const { error } = await supabase
        .from(supabaseConfig.schema[table].name)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  }
};

// Хелперы для работы с конкретными таблицами
export const ordersDb = {
  async getAll() {
    return db.select('orders');
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(supabaseConfig.schema.orders.name)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting order by id:', error);
      throw error;
    }
  },

  async create(order) {
    return db.insert('orders', order);
  },

  async update(id, data) {
    return db.update('orders', id, data);
  },

  async updateStatus(id, status) {
    return db.update('orders', id, { status });
  }
};

export const clientsDb = {
  async getAll() {
    return db.select('clients');
  },

  async getByPhone(phone) {
    try {
      const { data, error } = await supabase
        .from(supabaseConfig.schema.clients.name)
        .select('*')
        .eq('phone', phone)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting client by phone:', error);
      throw error;
    }
  },

  async create(client) {
    return db.insert('clients', client);
  },

  async update(id, data) {
    return db.update('clients', id, data);
  }
};

export const shopsDb = {
  async getAll() {
    return db.select('shops');
  },

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(supabaseConfig.schema.shops.name)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting shop by id:', error);
      throw error;
    }
  },

  async create(shop) {
    return db.insert('shops', shop);
  },

  async update(id, data) {
    return db.update('shops', id, data);
  }
};
