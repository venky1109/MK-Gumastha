import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const packingApi = createApi({
  reducerPath: 'packingApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_INVENTORY_API }),  // Replace with your base API URL
  tagTypes: ['Packing'],
  endpoints: (builder) => ({
    getPacking: builder.query({
      query: () => '/packing', // Endpoint for fetching all packing data
      providesTags: ['Packing'],
    }),
    addPacking: builder.mutation({
      query: (newPacking) => ({
        url: '/packing',
        method: 'POST',
        body: newPacking,
      }),
      invalidatesTags: ['Packing'],
    }),
    updatePacking: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/packing/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Packing'],
    }),
    updateAvailableQtyByKey: builder.mutation({
  query: ({ key, availableQuantity }) => ({
    url: `/purchases/update-available-by-key/${key}`,
    method: 'PUT',
    body: { availableQuantity },
  }),
  invalidatesTags: ['Packing'],
}),

    deletePacking: builder.mutation({
      query: (id) => ({
        url: `/packing/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Packing'],
    }),
  }),
});

export const {
  useGetPackingQuery,
  useAddPackingMutation,
  useUpdatePackingMutation,
  useDeletePackingMutation,
  useUpdateAvailableQtyByKeyMutation, 
} = packingApi;
