import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.REACT_APP_SUPABASE_DIRECT_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const executeQuery = async (query, params = []) => {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const fetchOrders = async (filters = {}) => {
  const { status, startDate, endDate } = filters;
  let query = 'SELECT * FROM orders WHERE 1=1';
  const params = [];
  let paramIndex = 1;

  if (status) {
    query += ` AND status = $${paramIndex}`;
    params.push(status);
    paramIndex++;
  }

  if (startDate) {
    query += ` AND created_at >= $${paramIndex}`;
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    query += ` AND created_at <= $${paramIndex}`;
    params.push(endDate);
    paramIndex++;
  }

  query += ' ORDER BY created_at DESC';

  return await executeQuery(query, params);
};

export const createOrder = async (orderData) => {
  const {
    number, status, client_phone, address, delivery_time, 
    total_price, items, client_comment, shop, florist,
    delivery_address, delivery_date, store_id, florist_name
  } = orderData;

  const query = `
    INSERT INTO orders (
      number, status, client_phone, address, delivery_time, 
      total_price, items, client_comment, shop, florist,
      delivery_address, delivery_date, store_id, florist_name
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *
  `;

  const params = [
    number, status, client_phone, address, delivery_time, 
    total_price, JSON.stringify(items), client_comment, shop, florist,
    delivery_address, delivery_date, store_id, florist_name
  ];

  return await executeQuery(query, params);
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const query = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
  return await executeQuery(query, [newStatus, orderId]);
};

export const uploadOrderPhoto = async (orderId, photoUrl) => {
  const query = `
    UPDATE orders 
    SET photos = array_append(photos, $1) 
    WHERE id = $2 
    RETURNING *
  `;
  return await executeQuery(query, [photoUrl, orderId]);
};
