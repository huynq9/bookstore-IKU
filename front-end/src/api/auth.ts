import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  AuthResponse,
  // AuthResponse,
  ILoginRequest,
  IRegisterRequest,
  IUser,
} from "../interfaces/auth";
import { AxiosResponse } from "axios";
import { RootState } from "../store/store";

const authApi = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
    prepareHeaders(headers, {getState}) {
      const token = (getState() as RootState).user.token
      if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        return headers
  }, 
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], void>({
      query: () => `/auth/users`,
      providesTags: ['User'],
    }),
    login: builder.mutation<AuthResponse, ILoginRequest>({
      query: (data) => ({
        url: `auth/login`,
        method:'POST',
        body:data
      }),
    }),
    register: builder.mutation<AxiosResponse, IRegisterRequest>({
      query: (data) => ({
        url: `auth/register`,
        method:'POST',
        body:data
      }),
    }),
    deleteUser: builder.mutation<AxiosResponse, string>({
      query: (data) => ({
        url: `auth/users/${data}`,
        method:'DELETE',
      }),
      invalidatesTags:['User']
    }),
    changePassword: builder.mutation<AxiosResponse, {oldPassword:string, newPassword: string, confirmNewPassword: string}>({
      query: (data) => ({
        url: `/auth/user/change/password`,
        method:'POST',
        body: data
      }),
      invalidatesTags:['User']
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useDeleteUserMutation, useGetUsersQuery, useChangePasswordMutation } = authApi;

export const authReducer = authApi.reducer;
export default authApi;
