import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBook } from "../../interfaces/book";

interface IBookState{
  books: IBook[],

}
const initialState : IBookState= {
  books: [],
};

const booksSlice = createSlice({
  name: "books",
  initialState: initialState,
  reducers: {
    loadBooks: (state, action: PayloadAction<IBook[]>) => {
      state.books = action.payload;
    },
    addBook: (state, action: PayloadAction<IBook>) => {
      state.books.push(action.payload);
    },
    updateBook: (state, action: PayloadAction<IBook>) => {
      const bookIndex = state.books.findIndex(
        (book) => book._id === action.payload._id
      );
      if (bookIndex !== -1) {
        state.books[bookIndex] = action.payload;
      }
    },
    removeBook: (state, action: PayloadAction<string>) => {
      const bookIdToRemove = action.payload;
      state.books = state.books.filter((book) => book._id !== bookIdToRemove);
    },
    // loadDiscountedBooks: (state, action: PayloadAction<IBook[]>) => {
    //   state.discountedBooks = action.payload.filter((book) => book.discount < book.price);
    // },
    // loadBestSellingBooks: (state, action: PayloadAction<IBook[]>) => {
    //   state.bestSellingBooks = action.payload.filter((book) => book.soldCount > 100);
    // },

    // loadHighlyRatedBooks: (state, action: PayloadAction<IBook[]>) => {
    //   state.highlyRatedBooks = action.payload.filter(item=>Number(item.averageRating)> 4.5);
    // },
  },
});

export const {
  loadBooks,
  addBook,
  removeBook,
  updateBook,
  // loadDiscountedBooks,
  // loadBestSellingBooks,
  // loadHighlyRatedBooks,
} = booksSlice.actions;

export const booksSliceReducer = booksSlice.reducer;
