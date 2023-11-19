import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import IVoucher from "../interfaces/voucher";

const voucherApi = createApi({
  reducerPath: "voucher",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/",
  }),
  tagTypes: ["Voucher"],
  endpoints: (builder) => ({
    getVouchers: builder.query<IVoucher[], void>({
      query: () => `/vouchers`,
      providesTags: ["Voucher"],
    }),
    getVoucherById: builder.query<IVoucher, string>({
      query: (id) => ({
        url: `/vouchers/${id}`,
      }),
      providesTags: ["Voucher"],
    }),
    createVoucher: builder.mutation<IVoucher, Partial<IVoucher>>({
      query: (voucher) => ({
        url: `/vouchers/add`,
        method: "POST",
        body: voucher,
      }),
      invalidatesTags: ["Voucher"],
    }),
    updateVoucher: builder.mutation<IVoucher, Partial<IVoucher>>({
      query: (voucher) => ({
        url: `/vouchers/${voucher._id}/edit`,
        method: "PATCH",
        body: voucher,
      }),
      invalidatesTags: ["Voucher"],
    }),
    deleteVoucher: builder.mutation<void, string>({
      query: (id) => ({
        url: `/vouchers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Voucher"],
    }),
  }),
});

export const {
  useGetVouchersQuery,
  useGetVoucherByIdQuery,
  useCreateVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation,
} = voucherApi;

export const voucherReducer = voucherApi.reducer;
export default voucherApi;
