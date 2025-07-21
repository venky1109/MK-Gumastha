import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const outletApi = createApi({
  reducerPath: 'outletApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_INVENTORY_API }),
  tagTypes: ['Outlet'],
  endpoints: (builder) => ({
    getOutlets: builder.query({ query: () => '/outlets', providesTags: ['Outlet'] }),
    addOutlet: builder.mutation({
      query: (body) => ({ url: '/outlets', method: 'POST', body }),
      invalidatesTags: ['Outlet'],
    }),
    updateOutlet: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/outlets/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Outlet'],
    }),
    deleteOutlet: builder.mutation({
      query: (id) => ({ url: `/outlets/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Outlet'],
    }),
  }),
});

export const {
  useGetOutletsQuery,
  useAddOutletMutation,
  useUpdateOutletMutation,
  useDeleteOutletMutation,
} = outletApi;
