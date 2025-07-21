import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_INVENTORY_API }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query({ query: () => '/products', providesTags: ['Product'] }),
    addProduct: builder.mutation({
      query: (newProduct) => ({ url: '/products', method: 'POST', body: newProduct }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/products/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
