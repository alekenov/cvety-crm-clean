import { schema } from '../schema';
import { DatabaseError, DatabaseErrorTypes } from './error-handler';
import * as CONSTANTS from '../constants';

// Валидация данных перед вставкой/обновлением
export const validateData = (table, data) => {
  const tableSchema = schema[table];
  if (!tableSchema) {
    throw new DatabaseError(
      DatabaseErrorTypes.VALIDATION,
      `Table ${table} does not exist`
    );
  }

  const errors = [];
  
  // Проверяем каждое поле
  Object.entries(data).forEach(([field, value]) => {
    // Проверяем существование поля
    if (!tableSchema.columns[field]) {
      errors.push(`Field ${field} does not exist in table ${table}`);
      return;
    }

    // Проверяем enum значения
    if (field === 'status' && table === 'orders') {
      if (!Object.values(CONSTANTS.ORDER_STATUS).includes(value)) {
        errors.push(`Invalid order status: ${value}`);
      }
    }

    if (field === 'payment_status') {
      if (!Object.values(CONSTANTS.PAYMENT_STATUS).includes(value)) {
        errors.push(`Invalid payment status: ${value}`);
      }
    }

    if (field === 'role' && table === 'employees') {
      if (!Object.values(CONSTANTS.EMPLOYEE_ROLE).includes(value)) {
        errors.push(`Invalid employee role: ${value}`);
      }
    }

    // Проверяем обязательные поля
    if (value === undefined || value === null) {
      if (field === 'id' || field === 'created_at') {
        return; // Эти поля генерируются автоматически
      }
      errors.push(`Field ${field} is required`);
    }
  });

  if (errors.length > 0) {
    throw new DatabaseError(
      DatabaseErrorTypes.VALIDATION,
      'Validation failed: ' + errors.join(', ')
    );
  }

  return true;
};

// Валидация запросов
export const validateQuery = (table, query = {}) => {
  const tableSchema = schema[table];
  if (!tableSchema) {
    throw new DatabaseError(
      DatabaseErrorTypes.VALIDATION,
      `Table ${table} does not exist`
    );
  }

  const errors = [];

  // Проверяем поля в условиях запроса
  Object.keys(query).forEach(field => {
    if (!tableSchema.columns[field]) {
      errors.push(`Field ${field} does not exist in table ${table}`);
    }
  });

  if (errors.length > 0) {
    throw new DatabaseError(
      DatabaseErrorTypes.VALIDATION,
      'Query validation failed: ' + errors.join(', ')
    );
  }

  return true;
};
