import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  IAddToCartRequest,
  ICartResponse,
  IUpdateCartRequest,
} from "../interfaces/cart";
import { RootState } from "../store/store";


const cartApi = createApi({
  reducerPath: "cart",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders(headers, {getState}) {
        const token = (getState() as RootState).user.token
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
          }
          headers.set('Content-Type', 'application/json');
          return headers
    },
  }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<ICartResponse, void>({
      query: () =>"carts",
      providesTags:['Cart']
    }),
    addToCart: builder.mutation<ICartResponse, IAddToCartRequest>({
      query: (data) => ({
        url: "carts/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags:['Cart']
    }),
    updateCart: builder.mutation<ICartResponse, IUpdateCartRequest>({
      query: (data) => ({
        url: "carts/edit",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags:['Cart']
    }),
  }),
});

export const { useGetCartQuery, useAddToCartMutation, useUpdateCartMutation } =
  cartApi;

export const cartReducer = cartApi.reducer;
export default cartApi;
