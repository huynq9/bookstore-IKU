import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IBook } from "../interfaces/book";

const productApi = createApi({
  reducerPath: "product",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
  }),
  tagTypes: ["Book"],
  endpoints: (builder) => ({
    getProducts: builder.query<IBook[], void>({
      query: () => `/books`,
      providesTags: ["Book"],
    }),
    getTopSellingBooks: builder.query<IBook[], void>({
      query: () => `/books/top-selling`,
      providesTags: ["Book"],
    }),

    getProductById: builder.query<IBook, string>({
      query: (id) => ({
        url: `/books/${id}`,
      }),
      providesTags: ["Book"],
    }),
    deleteProduct: builder.mutation<IBook, string>({
      query: (id) => ({
        url: `/books/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Book"],
    }),
    deleteProducts: builder.mutation<void, string[]>({
      query: (ids) => ({
        url: `/books/delete-books`,
        method: "DELETE",
        body: ids,
      }),
      invalidatesTags: ["Book"],
    }),
    addProduct: builder.mutation<IBook, IBook>({
      query: (book) => ({
        url: `/books/add`,
        method: "POST",
        body: book,
      }),
      invalidatesTags: ["Book"],
    }),
    editProduct: builder.mutation<IBook, IBook>({
      query: (book) => ({
        url: `/books/${book._id}/edit`,
        method: "PATCH",
        body: book,
      }),
      invalidatesTags: ["Book"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useDeleteProductMutation,
  useAddProductMutation,
  useGetProductByIdQuery,
  useEditProductMutation,
} = productApi;
export const productReducer = productApi.reducer;
export default productApi;
