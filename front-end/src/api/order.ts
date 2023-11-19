import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOrderRequestAdd, IOrderResponse } from "../interfaces/order";
import { RootState } from "../store/store";

const orderApi = createApi({
  reducerPath: "order",
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
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getAllOrders: builder.query<IOrderResponse[], void>({
      query: () => 'order', // Update with your actual endpoint
      providesTags:['Order'],
    }),
    getUserOrders: builder.query<IOrderResponse[], void>({
      query: () => 'order/list', // Update with your actual endpoint
      providesTags:['Order'],
    }),
    getOrderById: builder.query<IOrderResponse, string>({
      query: (id) => `order/${id}`,
      providesTags:['Order'],
    }),
    createOrder: builder.mutation<IOrderResponse, IOrderRequestAdd>({
      query: (data) => ({
        url: 'order/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrder: builder.mutation<IOrderResponse, { id: string, data: IOrderRequestAdd }>({
      query: ({ id, data }) => ({
        url: `order/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation<IOrderResponse,  string>({
      query: ( id ) => ({
        url: `order/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
    changeStatus: builder.mutation<IOrderResponse,  {id: string, newStatus: {newStatus: number}}>({
      query: ( { id, newStatus } ) => ({
        url: `order/${id}/changeOrderStatus`,
        method: 'PATCH',
        body: newStatus
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useGetUserOrdersQuery,
  useDeleteOrderMutation,
  useChangeStatusMutation
} = orderApi;

export const orderReducer = orderApi.reducer;
export default orderApi;