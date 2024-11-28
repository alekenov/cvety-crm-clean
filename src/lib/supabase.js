import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tbjozecglteemnrbtjsb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiam96ZWNnbHRlZW1ucmJ0anNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3NDcyOTAsImV4cCI6MjA0NjMyMzI5MH0.LLeuhNyCuNYZj2Jl14b_9-yCywKvXArmGWZk1u4qFdY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Error handling utility
export const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error);
  throw new Error(error.message || 'An error occurred while connecting to the database');
};

// Orders API
export const ordersApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) handleSupabaseError(error);
    return data;
  },

  async create(order) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();
    
    if (error) handleSupabaseError(error);
    return data;
  },

  async updateStatus(id, status) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);
    
    if (error) handleSupabaseError(error);
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleSupabaseError(error);
    return data;
  }
};

// Products API
export const productsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) handleSupabaseError(error);
    return data;
  },

  async create(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) handleSupabaseError(error);
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) handleSupabaseError(error);
    return data;
  }
};

// Shops API
export const shopsApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('shops')
        .select(`
          *,
          employees (*)
        `)
        .order('name');

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async create(shop) {
    try {
      const { data, error } = await supabase
        .from('shops')
        .insert([{
          name: shop.name,
          address: shop.address,
          phone: shop.phone,
          whatsapp: shop.whatsapp,
          instagram: shop.instagram,
          working_hours: shop.working_hours,
          settings: shop.settings
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('shops')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('shops')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

// Employees API
export const employeesApi = {
  async getAll(shopId) {
    try {
      const query = supabase
        .from('employees')
        .select('*')
        .order('name');

      if (shopId) {
        query.eq('shop_id', shopId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async create(employee) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .insert([{
          shop_id: employee.shop_id,
          name: employee.name,
          role: employee.role,
          phone: employee.phone
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async delete(id) {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

// Inventory API
export const inventoryApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          product:product_id (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async update(id, updates) {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

export default supabase;
