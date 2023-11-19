import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: 'filter',
    initialState: {
      searchQuery: '', // Trường tìm kiếm
      searchResults: [], // Kết quả tìm kiếm
      filters: {
        category: null, // Lọc theo danh mục sách
        author: null, // Lọc theo tác giả sách
        priceRange: null, // Lọc theo khoảng giá
        // Thêm các trường lọc khác nếu cần
      },
    },
    reducers: {
      setSearchQuery: (state, action) => {
        state.searchQuery = action.payload;
      },
      setCategoryFilter: (state, action) => {
        state.filters.category = action.payload;
      },
      setAuthorFilter: (state, action) => {
        state.filters.author = action.payload;
      },
      setPriceRangeFilter: (state, action) => {
        state.filters.priceRange = action.payload;
      },
      clearFilters: (state) => {
        state.filters.category = null;
        state.filters.author = null;
        state.filters.priceRange = null;
        // Đặt lại các trường lọc khác nếu cần
      },
    },
  });

export const { setSearchQuery, setCategoryFilter, setAuthorFilter, setPriceRangeFilter, clearFilters } = filterSlice.actions;

const filterReducer = filterSlice.reducer;
export default filterReducer;