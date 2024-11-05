import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    setClients: (state, action) => {
      state.items = action.payload;
    },
    addClient: (state, action) => {
      state.items.push(action.payload);
    },
    updateClient: (state, action) => {
      const index = state.items.findIndex(client => client.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteClient: (state, action) => {
      state.items = state.items.filter(client => client.id !== action.payload);
    },
  },
});

export const { setClients, addClient, updateClient, deleteClient } = clientsSlice.actions;
export default clientsSlice.reducer; 