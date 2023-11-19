import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchTerm: '',
    searchType: 'all', // Mặc định tìm kiếm theo tất cả
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
    },
  },
});

export const { setSearchTerm, setSearchType } = searchSlice.actions;


export default searchSlice.reducer;