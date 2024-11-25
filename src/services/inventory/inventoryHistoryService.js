import { supabase } from '../../lib/supabase';
import { logger } from '../logging/loggingService';

class InventoryHistoryService {
  constructor() {
    logger.log('InventoryHistoryService', 'Initializing inventory history service');
  }

  /**
   * Получить историю операций со складом с пагинацией и фильтрацией
   */
  async getHistory({ 
    page = 1, 
    pageSize = 10, 
    operationType = null,
    startDate = null,
    endDate = null,
    flowerName = null,
    userId = null 
  }) {
    try {
      logger.log('InventoryHistoryService', 'Fetching inventory history', {
        page,
        pageSize,
        operationType,
        startDate,
        endDate,
        flowerName,
        userId
      });

      let query = supabase
        .from('inventory_history_view')
        .select('*', { count: 'exact' });

      // Применяем фильтры
      if (operationType) {
        query = query.eq('operation_type', operationType);
      }

      if (startDate) {
        query = query.gte('operation_date', startDate);
      }

      if (endDate) {
        query = query.lte('operation_date', endDate);
      }

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (flowerName) {
        // Поиск по цветам в массиве items
        query = query.contains('items', [{ flower_name: flowerName }]);
      }

      // Добавляем пагинацию
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query
        .order('operation_date', { ascending: false })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        logger.error('InventoryHistoryService', 'Database query error', { 
          error: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code 
        });
        throw error;
      }

      if (!data) {
        logger.error('InventoryHistoryService', 'No data returned from query');
        throw new Error('No data returned from query');
      }

      logger.log('InventoryHistoryService', 'Successfully fetched inventory history', {
        resultCount: data.length,
        totalCount: count,
        page,
        pageSize,
        filters: { operationType, startDate, endDate, flowerName, userId }
      });

      return {
        data,
        total: count
      };
    } catch (error) {
      logger.error('InventoryHistoryService', 'Error fetching inventory history', { 
        error: error.message,
        stack: error.stack,
        name: error.name
      });
      throw new Error(`Failed to fetch inventory history: ${error.message}`);
    }
  }

  /**
   * Добавить новую запись в историю
   */
  async addHistoryRecord({ 
    operationType, 
    items, 
    orderId = null, 
    comment = null 
  }) {
    try {
      logger.log('InventoryHistoryService', 'Adding new history record', {
        operationType,
        items,
        orderId,
        comment
      });

      // Начинаем транзакцию
      const { data: historyRecord, error: historyError } = await supabase
        .from('inventory_history')
        .insert({
          operation_type: operationType,
          order_id: orderId,
          comment: comment
        })
        .select()
        .single();

      if (historyError) {
        throw historyError;
      }

      // Добавляем детали операции
      const historyItems = items.map(item => ({
        history_id: historyRecord.id,
        flower_name: item.flowerName,
        stem_length: item.stemLength,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('inventory_history_items')
        .insert(historyItems);

      if (itemsError) {
        throw itemsError;
      }

      logger.log('InventoryHistoryService', 'Successfully added history record', {
        historyId: historyRecord.id
      });

      return historyRecord;
    } catch (error) {
      logger.error('InventoryHistoryService', 'Error adding history record', { error });
      throw error;
    }
  }

  /**
   * Получить детали конкретной операции
   */
  async getHistoryDetails(historyId) {
    try {
      logger.log('InventoryHistoryService', 'Fetching history details', { historyId });

      const { data, error } = await supabase
        .from('inventory_history_view')
        .select('*')
        .eq('id', historyId)
        .single();

      if (error) {
        throw error;
      }

      logger.log('InventoryHistoryService', 'Successfully fetched history details');

      return data;
    } catch (error) {
      logger.error('InventoryHistoryService', 'Error fetching history details', { error });
      throw error;
    }
  }
}

export const inventoryHistoryService = new InventoryHistoryService();
