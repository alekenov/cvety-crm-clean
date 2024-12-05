import { supabase } from '@/lib/supabase';

class OperationsService {
  async getOperations() {
    try {
      const { data, error } = await supabase
        .from('operations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching operations:', error);
      throw error;
    }
  }

  async createOperation(operation) {
    try {
      const { data, error } = await supabase
        .from('operations')
        .insert([operation])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating operation:', error);
      throw error;
    }
  }
}

export const operationsService = new OperationsService();
