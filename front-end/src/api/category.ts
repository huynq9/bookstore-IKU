import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ICategory } from "../interfaces/category";

const categoryApi = createApi({
  reducerPath: "category",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
  }),
  tagTypes: ["Category"],
  endpoints: (builder) => ({
    getCategories: builder.query<ICategory[], void>({
      query: () => `/categories`,
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query<ICategory, string>({
      query: (id) => ({
        url: `/categories/${id}`,
      }),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation<ICategory, Partial<ICategory>>({
      query: (category) => ({
        url: `/categories/add`,
        method: "POST",
        body: category,
      }),
      invalidatesTags: ["Category"],
    }),
    updateCategory: builder.mutation<ICategory, Partial<ICategory>>({
      query: (category) => ({
        url: `/categories/${category._id}/edit`,
        method: "PATCH",
        body: category,
      }),
      invalidatesTags: ["Category"],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;

export const categoryReducer = categoryApi.reducer;
export default categoryApi;
