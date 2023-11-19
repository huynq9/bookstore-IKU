import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AuthorIdType } from "../interfaces/author";

const authorApi = createApi({
  reducerPath: "author",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
  }),
  tagTypes: ["Author"],
  endpoints: (builder) => ({
    getAuthors: builder.query<AuthorIdType[], void>({
      query: () => `/authors`,
      providesTags: ["Author"],
    }),
    getAuthorById: builder.query<AuthorIdType, string>({
      query: (id) => ({
        url: `/authors/${id}`,
      }),
      providesTags: ["Author"],
    }),
    createAuthor: builder.mutation<AuthorIdType, Partial<AuthorIdType>>({
      query: (author) => ({
        url: `/authors`,
        method: "POST",
        body: author,
      }),
      invalidatesTags: ["Author"],
    }),
    updateAuthor: builder.mutation<AuthorIdType, Partial<AuthorIdType>>({
      query: (author) => ({
        url: `/authors/${author._id}`,
        method: "PATCH",
        body: author,
      }),
      invalidatesTags: ["Author"],
    }),
    deleteAuthor: builder.mutation<void, string>({
      query: (id) => ({
        url: `/authors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Author"],
    }),
  }),
});

export const {
  useGetAuthorsQuery,
  useGetAuthorByIdQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
} = authorApi;

export const authorReducer = authorApi.reducer;
export default authorApi;
