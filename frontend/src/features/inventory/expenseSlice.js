import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const expenseApi = createApi({
  reducerPath: 'expenseApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_INVENTORY_API }),  // Replace with your base API URL
  tagTypes: ['Expense'],
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: () => '/expenses', // Endpoint for fetching all expenses
      providesTags: ['Expense'],
    }),
    addExpense: builder.mutation({
      query: (newExpense) => ({
        url: '/expenses',
        method: 'POST',
        body: newExpense,
      }),
      invalidatesTags: ['Expense'],
    }),
    updateExpense: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/expenses/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Expense'],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `/expenses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Expense'],
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
