import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import productApi, { productReducer } from "../api/product";
import categoryApi, { categoryReducer } from "../api/category";
import authorApi, { authorReducer } from "../api/author";
import authApi, { authReducer } from "../api/auth";
import filterReducer from "./book/FilterSlice";
import authSlice from "./auth/authSlice";
import voucherApi, { voucherReducer } from "../api/voucher";
import { booksSliceReducer } from "./book/productSlice";
import { categorySliceReducer } from "./category/categorySlice";
import cartApi, { cartReducer } from "../api/cart";
import orderApi, { orderReducer } from "../api/order";
import cartSlice from "./cart/cartSlice";
import searchSlice from "./search/searchSlice";
// import { productReducer } from '../slices/Product';
// import { cartReducer } from '@/slices/Cart';

const persistConfig = {
  key: "root",
  storage,
  whitelist: [ "user", "carts"],
};
const rootReducer = combineReducers({
  [productApi.reducerPath]: productReducer,
  [categoryApi.reducerPath]: categoryReducer,
  [authorApi.reducerPath]: authorReducer,
  [authApi.reducerPath]: authReducer,
  [voucherApi.reducerPath]: voucherReducer,
  [cartApi.reducerPath]: cartReducer,
  [orderApi.reducerPath]: orderReducer,
  carts: cartSlice,
  searchFilter: filterReducer,
  user: authSlice.reducer,
  products: booksSliceReducer,
  categories: categorySliceReducer,
  search: searchSlice

  // cart: cartReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      productApi.middleware,
      categoryApi.middleware,
      authorApi.middleware,
      authApi.middleware,
      voucherApi.middleware,
      orderApi.middleware,
      cartApi.middleware,

    ]),
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default persistStore(store);
