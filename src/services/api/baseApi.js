import { supabase, handleSupabaseError, TABLES } from '../../lib/supabase';

export class BaseApi {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Базовые CRUD операции
  async getAll(select = '*') {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(select)
        .order('created_at', { ascending: false });

      handleSupabaseError(error);
      return data;
    } catch (error) {
      console.error(`Error in ${this.tableName}.getAll:`, error);
      throw error;
    }
  }

  async getById(id, select = '*') {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(select)
        .eq('id', id)
        .single();

      handleSupabaseError(error);
      return data;
    } catch (error) {
      console.error(`Error in ${this.tableName}.getById:`, error);
      throw error;
    }
  }

  async create(item) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([item])
        .select();

      handleSupabaseError(error);
      return data[0];
    } catch (error) {
      console.error(`Error in ${this.tableName}.create:`, error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update(updates)
        .eq('id', id)
        .select();

      handleSupabaseError(error);
      return data[0];
    } catch (error) {
      console.error(`Error in ${this.tableName}.update:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      handleSupabaseError(error);
      return true;
    } catch (error) {
      console.error(`Error in ${this.tableName}.delete:`, error);
      throw error;
    }
  }

  // Утилиты для работы с запросами
  async executeRawQuery(query) {
    try {
      const { data, error } = await query;
      handleSupabaseError(error);
      return data;
    } catch (error) {
      console.error(`Error in ${this.tableName}.executeRawQuery:`, error);
      throw error;
    }
  }
}
