import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const purchaseApi = createApi({
  reducerPath: 'purchaseApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_INVENTORY_API }),  // Replace with your base API URL
  tagTypes: ['Purchase'],
  endpoints: (builder) => ({
    // Fetch all purchases without status filter
    getAllPurchases: builder.query({
      query: () => '/purchases', // No status filter
      providesTags: ['Purchase'],
    }),
    
    // Fetch purchases with status filter (unapproved, pending, approved, etc.)
    getPurchasesWithStatus: builder.query({
      query: (status) => `/purchases?status=${status}`, // Pass status as parameter
      providesTags: ['Purchase'],
    }),
    
    // Add a new purchase
    addPurchase: builder.mutation({
      query: (newPurchase) => ({
        url: '/purchases',
        method: 'POST',
        body: newPurchase,
      }),
      invalidatesTags: ['Purchase'],
    }),
   // In your purchaseSlice.js

// Approve a purchase
updatePurchase: builder.mutation({
  query: ({ key, status }) => ({
    url: `/purchases/${key}/approve`, // Use key in the URL
    method: 'PUT',
    body: { status },
  }),
  invalidatesTags: ['Purchase'],
}),

// Reject a purchase
rejectPurchase: builder.mutation({
  query: ({ key, status }) => ({
    url: `/purchases/${key}/reject`, // Use key in the URL
    method: 'PUT',
    body: { status },
  }),
  invalidatesTags: ['Purchase'],
}),

// Delete a purchase
deletePurchase: builder.mutation({
  query: (key) => ({
    url: `/purchases/${key}`, // Use key for deletion
    method: 'DELETE',
  }),
  invalidatesTags: ['Purchase'],
}),

  }),
});

export const {
  useGetAllPurchasesQuery,  // Hook to fetch all purchases
  useGetPurchasesWithStatusQuery,  // Hook to fetch purchases with status
  useAddPurchaseMutation,
  useUpdatePurchaseMutation,
  useRejectPurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
