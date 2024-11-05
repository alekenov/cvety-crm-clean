import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 1,
      name: "Айгуль",
      phone: "+7 (777) 123-45-67",
      totalOrders: 5,
      totalSpent: 75000,
      lastOrder: "15.09.2024",
      tags: ["День рождения: 10 марта", "Любит розы"]
    },
    {
      id: 2,
      name: "Мария",
      phone: "+7 (777) 234-56-78",
      totalOrders: 3,
      totalSpent: 45000,
      lastOrder: "20.08.2024",
      tags: ["Предпочитает доставку"]
    },
    {
      id: 3,
      name: "Анара",
      phone: "+7 (777) 345-67-89",
      totalOrders: 7,
      totalSpent: 100000,
      lastOrder: "05.09.2024",
      tags: ["Аллергия на лилии"]
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
    },
    addTag: (state, action) => {
      const { clientId, tag } = action.payload;
      const client = state.items.find(c => c.id === clientId);
      if (client) {
        if (!client.tags) client.tags = [];
        client.tags.push(tag);
      }
    },
    removeTag: (state, action) => {
      const { clientId, tagIndex } = action.payload;
      const client = state.items.find(c => c.id === clientId);
      if (client && client.tags) {
        client.tags.splice(tagIndex, 1);
      }
    }
  }
});

export const { addClient, removeClient, updateClient, addTag, removeTag } = clientsSlice.actions;
export default clientsSlice.reducer; 