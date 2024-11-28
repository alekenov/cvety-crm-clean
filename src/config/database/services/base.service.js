import { supabase } from '../db';
import { withErrorHandling, withCache } from '../utils';
import { validateData, validateQuery } from '../utils/validation';

export class BaseService {
  constructor(tableName) {
    this.tableName = tableName;
    
    // Оборачиваем методы в кэширование
    this.getById = withCache(this._getById.bind(this), `${tableName}-by-id`);
    this.getAll = withCache(this._getAll.bind(this), `${tableName}-all`);
  }

  // Базовые методы
  _getAll = withErrorHandling(async (columns = '*') => {
    validateQuery(this.tableName);
    const { data, error } = await supabase
      .from(this.tableName)
      .select(columns);
    
    if (error) throw error;
    return data;
  });

  _getById = withErrorHandling(async (id, columns = '*') => {
    validateQuery(this.tableName, { id });
    const { data, error } = await supabase
      .from(this.tableName)
      .select(columns)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  });

  create = withErrorHandling(async (data) => {
    validateData(this.tableName, data);
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert({ ...data, created_at: new Date().toISOString() })
      .select()
      .single();
    
    if (error) throw error;
    return result;
  });

  update = withErrorHandling(async (id, data) => {
    validateData(this.tableName, data);
    const { data: result, error } = await supabase
      .from(this.tableName)
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  });

  delete = withErrorHandling(async (id) => {
    validateQuery(this.tableName, { id });
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  });

  // Дополнительные методы
  findOne = withErrorHandling(async (query, columns = '*') => {
    validateQuery(this.tableName, query);
    let request = supabase
      .from(this.tableName)
      .select(columns);
    
    Object.entries(query).forEach(([field, value]) => {
      request = request.eq(field, value);
    });
    
    const { data, error } = await request.single();
    
    if (error) throw error;
    return data;
  });

  findMany = withErrorHandling(async (query, columns = '*') => {
    validateQuery(this.tableName, query);
    let request = supabase
      .from(this.tableName)
      .select(columns);
    
    Object.entries(query).forEach(([field, value]) => {
      request = request.eq(field, value);
    });
    
    const { data, error } = await request;
    
    if (error) throw error;
    return data;
  });

  // Методы для работы с пагинацией
  paginate = withErrorHandling(async ({ page = 1, limit = 10, columns = '*' }) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabase
      .from(this.tableName)
      .select(columns, { count: 'exact' })
      .range(from, to);
    
    if (error) throw error;
    
    return {
      data,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  });

  // Методы для работы с транзакциями
  transaction = withErrorHandling(async (callback) => {
    const { error } = await supabase.rpc('begin_transaction');
    if (error) throw error;

    try {
      const result = await callback();
      await supabase.rpc('commit_transaction');
      return result;
    } catch (error) {
      await supabase.rpc('rollback_transaction');
      throw error;
    }
  });
}
