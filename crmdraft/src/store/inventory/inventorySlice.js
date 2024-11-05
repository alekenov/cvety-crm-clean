import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [
    {
      id: 1,
      name: 'Роза красная',
      quantity: 150,
      price: 800,
      cost: 400,
      category: 'flowers'
    },
    {
      id: 2,
      name: 'Гипсофила',
      quantity: 80,
      price: 500,
      cost: 200,
      category: 'flowers'
    },
    {
      id: 3,
      name: 'Лента атласная',
      quantity: 0,
      price: 200,
      cost: 100,
      category: 'packaging'
    }
  ],
  loading: false,
  error: null,
  filters: {
    showEmpty: false,
    category: 'all',
    showCostInfo: false
  }
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    toggleEmptyItems: (state) => {
      state.filters.showEmpty = !state.filters.showEmpty;
    },
    setCategory: (state, action) => {
      state.filters.category = action.payload;
    },
    toggleCostInfo: (state) => {
      state.filters.showCostInfo = !state.filters.showCostInfo;
    },
    updateItemName: (state, action) => {
      const { id, name } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.name = name;
      }
    }
  }
});

export const { 
  toggleEmptyItems, 
  setCategory, 
  toggleCostInfo,
  updateItemName 
} = inventorySlice.actions;

export default inventorySlice.reducer; 