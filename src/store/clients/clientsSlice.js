import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 1,
      name: 'Иван Иванов',
      phone: '+7 (999) 123-45-67',
      email: 'ivan@example.com'
    },
    {
      id: 2,
      name: 'Мария Петрова',
      phone: '+7 (999) 765-43-21',
      email: 'maria@example.com'
    }
  ],
  loading: false,
  error: null
};

export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action) => {
      state.items.push(action.payload);
    },
    removeClient: (state, action) => {
      state.items = state.items.filter(client => client.id !== action.payload);
    },
    updateClient: (state, action) => {
      const index = state.items.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    }
  }
});

export const { addClient, removeClient, updateClient } = clientsSlice.actions;
export default clientsSlice.reducer; 