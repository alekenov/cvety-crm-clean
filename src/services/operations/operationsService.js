import { supabase } from '@/lib/supabase';

class OperationsService {
  async getOperations() {
    try {
      const { data, error } = await supabase
        .from('operations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return data.map(operation => ({
        ...operation,
        order: null // Temporarily set order to null until we fix the relationship
      }));
    } catch (error) {
      console.error('Error fetching operations:', error);
      throw error;
    }
  }

  async createOperation(operation) {
    try {
      // Convert amount to number if it's a string
      const operationData = {
        ...operation,
        amount: typeof operation.amount === 'string' ? Number(operation.amount) : operation.amount
      };

      const { data, error } = await supabase
        .from('operations')
        .insert([operationData])
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return {
        ...data[0],
        order: null // Temporarily set order to null until we fix the relationship
      };
    } catch (error) {
      console.error('Error creating operation:', error);
      throw error;
    }
  }

  async updateOperation(id, operation) {
    try {
      const operationData = {
        ...operation,
        amount: typeof operation.amount === 'string' ? Number(operation.amount) : operation.amount
      };

      const { data, error } = await supabase
        .from('operations')
        .update(operationData)
        .eq('id', id)
        .select('*');

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return {
        ...data[0],
        order: null // Temporarily set order to null until we fix the relationship
      };
    } catch (error) {
      console.error('Error updating operation:', error);
      throw error;
    }
  }

  async deleteOperation(id) {
    try {
      const { error } = await supabase
        .from('operations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Error deleting operation:', error);
      throw error;
    }
  }
}

export const operationsService = new OperationsService();
