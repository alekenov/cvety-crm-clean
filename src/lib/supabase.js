import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Supabase client configuration
const supabaseConfig = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'cvety-crm'
    }
  }
};

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseConfig);

// Error handling utility
const handleSupabaseError = (error) => {
  console.error('Supabase Error:', error);
  throw new Error(error.message || 'An error occurred while accessing the database');
};

// Orders API
export const ordersApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items,
          store:store_id (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async create(order) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          number: order.number,
          status: order.status || 'Оплачен',
          client_phone: order.client_phone,
          address: order.address,
          delivery_time: order.delivery_time,
          total_price: order.total_price,
          items: order.items,
          client_comment: order.client_comment,
          shop: order.shop,
          florist: order.florist,
          delivery_address: order.delivery_address,
          delivery_date: order.delivery_date,
          store_id: order.store_id,
          florist_name: order.florist_name
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async updateStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
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
        .from('orders')
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
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
  }
};

// Products API
export const productsApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          compositions:product_compositions (
            *,
            inventory_item:inventory_item_id (*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
    }
  },

  async create(product) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          category: product.category,
          price: product.price,
          base_price: product.base_price,
          markup_amount: product.markup_amount,
          packaging_cost: product.packaging_cost,
          description: product.description,
          status: product.status || 'active',
          image_url: product.image_url,
          sku: product.sku
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
        .from('products')
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
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
    }
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

export { supabase };
