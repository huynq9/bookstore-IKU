import { createSlice } from "@reduxjs/toolkit";
import { IBook } from "../../interfaces/book";

export interface ICartState {
  _id?: string;
  items: {
    _id?: string;
    book: IBook;
    quantity: number;
  }[];
  totalMoney: number;
}
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalMoney: 0,
  },
  reducers: {
    addToCartLocal: (state: ICartState, action) => {
      const { book, quantity } = action.payload;
      const existingItem = state.items.findIndex(
          (item) => item.book._id === book._id
          );

      if (existingItem !== -1) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        state.items[existingItem].quantity += 1;
      } else {
        console.log(quantity);

        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        state.items.push({ book, quantity });

      }
    },

    loadCart: (state: ICartState, action) => {
      const { items, totalMoney } = action.payload;
      state.items = items;
      state.totalMoney = totalMoney;
    },
    removeProductFromCart: (state: ICartState, action) => {
      const productIdToRemove = action.payload;
      state.items = state.items.filter(
        (item) => item.book._id !== productIdToRemove
      );
    },

    updateCartItemQuantity: (state: ICartState, action) => {
      const { productId, quantity } = action.payload;
      const itemToUpdate = state.items.findIndex(
        (item) => item.book._id === productId
      );

      if (itemToUpdate !== -1) {
        state.items[itemToUpdate].quantity = quantity;
        state.totalMoney = state.items.reduce((acc, curr)=>{
          return acc + (curr.book.discount * curr.quantity)
        }, 0)
        console.log(state.totalMoney)
      }
    },
  },
});

export const {
  addToCartLocal,
  loadCart,
  removeProductFromCart,
  updateCartItemQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
