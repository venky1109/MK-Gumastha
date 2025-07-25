import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import customerReducer from '../features/customers/customerSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/orders/orderSlice';
import catalogReducer from '../features/catalogs/catalogSlice';
import orderItemsReducer from '../features/orderItems/orderItemSlice';
import posUserReducer from '../features/auth/posUserSlice'
import paymentReducer from '../features/payment/paymentSlice';
import { productApi } from '../features/inventory/productSlice';
import { categoryApi } from '../features/inventory/categorySlice';
import { brandApi } from '../features/inventory/brandSlice';
import { unitApi } from '../features/inventory/unitSlice';
import { outletApi } from '../features/inventory/outletSlice';
import { purchaseApi } from '../features/inventory/purchaseSlice'; 
import { expenseApi } from '../features/inventory/expenseSlice';
import { packingApi } from '../features/inventory/packingSlice';

const stateMutationLogger = store => next => action => {
  const result = next(action);
  const state = store.getState();

  if (typeof state.orders.all !== 'object' || !Array.isArray(state.orders.all)) {
    console.error(`❌ Corrupted state.orders.all after ${action.type}:`, state.orders.all);
  }

  return result;
};



export const store = configureStore({
  reducer: {
    posUser: posUserReducer,
    catalogs: catalogReducer,
    orderItems: orderItemsReducer,
    products: productReducer,
    customers: customerReducer,
    cart: cartReducer,
    orders: orderReducer,
    payment: paymentReducer,
 
    // Inventory API reducers
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [unitApi.reducerPath]: unitApi.reducer,
    [outletApi.reducerPath]: outletApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,  // Ensure purchaseApi is added to store
     [expenseApi.reducerPath]: expenseApi.reducer, 
     [packingApi.reducerPath]: packingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stateMutationLogger).concat(
        productApi.middleware,
        categoryApi.middleware,
        brandApi.middleware,
        unitApi.middleware,
        outletApi.middleware,
         purchaseApi.middleware, 
         expenseApi.middleware,
         packingApi.middleware
      ),
});

