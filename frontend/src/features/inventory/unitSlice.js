import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const unitApi = createApi({
  reducerPath: 'unitApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_INVENTORY_API }),
  tagTypes: ['Unit'],
  endpoints: (builder) => ({
    getUnits: builder.query({ query: () => '/units', providesTags: ['Unit'] }),
    addUnit: builder.mutation({
      query: (body) => ({ url: '/units', method: 'POST', body }),
      invalidatesTags: ['Unit'],
    }),
    updateUnit: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/units/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Unit'],
    }),
    deleteUnit: builder.mutation({
      query: (id) => ({ url: `/units/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Unit'],
    }),
  }),
});

export const {
  useGetUnitsQuery,
  useAddUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitApi;
