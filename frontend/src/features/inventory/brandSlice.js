import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const brandApi = createApi({
  reducerPath: 'brandApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_INVENTORY_API }),
  tagTypes: ['Brand'],
  endpoints: (builder) => ({
    getBrands: builder.query({ query: () => '/brands', providesTags: ['Brand'] }),
    addBrand: builder.mutation({
      query: (body) => ({ url: '/brands', method: 'POST', body }),
      invalidatesTags: ['Brand'],
    }),
    updateBrand: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/brands/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Brand'],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({ url: `/brands/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Brand'],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
