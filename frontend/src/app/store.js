import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/products/productSlice';
import customerReducer from '../features/customers/customerSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/orders/orderSlice';
import catalogReducer from '../features/catalogs/catalogSlice';
import orderItemsReducer from '../features/orderItems/orderItemSlice';
import posUserReducer from '../features/auth/posUserSlice'
import paymentReducer from '../features/payment/paymentSlice';
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(stateMutationLogger),
});

