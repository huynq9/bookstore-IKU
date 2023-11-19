import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICategory } from "../../interfaces/category"; // Make sure to import the appropriate category interface

interface ICategoryState {
  categories: ICategory[];
  selectedCategory: ICategory | null;
}

const initialCategoryState: ICategoryState = {
  categories: [],
  selectedCategory: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState: initialCategoryState,
  reducers: {
    loadCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<ICategory>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<ICategory>) => {
      const categoryIndex = state.categories.findIndex(
        (category) => category._id === action.payload._id
      );
      if (categoryIndex !== -1) {
        state.categories[categoryIndex] = action.payload;
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      const categoryIdToRemove = action.payload;
      state.categories = state.categories.filter((category) => category._id !== categoryIdToRemove);
    },
    selectCategory: (state, action: PayloadAction<ICategory | null>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const {
  loadCategories,
  addCategory,
  removeCategory,
  updateCategory,
  selectCategory
} = categorySlice.actions;

export const categorySliceReducer = categorySlice.reducer;