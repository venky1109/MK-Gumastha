// 📁 src/features/orders/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateProductStockOnly } from '../products/productSlice';

// ➕ Create POS Order
export const createOrder = createAsyncThunk(
  'orders/create',
  async ({ payload, token, cartItems }, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders/pos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
  
      // console.log( JSON.stringify(payload))
     console.log('Status:', response.status); // should be 201
console.log('Response OK:', response.ok); // should be true
console.log('Data:', data);



      if (!response.ok) throw new Error(data.message || 'Order creation failed');
      console.log('stock update '+JSON.stringify(cartItems));
      for (const item of cartItems) {
        const newStock = item.stock;
        if (newStock >= 0) {
          // // await thunkAPI.dispatch(
          //   updateProductStockOnly({
          //     productID: item.id,
          //     brandID:item.brandId,
          //     financialID:item.financialId,
          //     newQuantity: newStock,
          //     token,
          //   })
          // // );
          try {
  await thunkAPI.dispatch(
    updateProductStockOnly({
      productID: item.id,
      brandID: item.brandId,
      financialID: item.financialId,
      newQuantity: newStock,
      token,
    })
  );
} catch (err) {
  console.warn('⚠️ Stock update failed for product:', item.id, err.message);
}

        }
      }
      
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 📥 Fetch Recent POS Orders
export const fetchLatestOrders = createAsyncThunk(
  'orders/fetchLatest',
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().posUser?.userInfo?.token;

    const response = await fetch('http://localhost:5000/api/orders/pos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data)
    if (!response.ok) throw new Error(data.message || 'Failed to fetch orders');

    return data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
 initialState: {
  all: [],
  latest: null,
  recent: [],
  loading: false,
  error: '',
},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
    .addCase(createOrder.fulfilled, (state, action) => {
  state.loading = false;
  state.latest = action.payload;

  if (!Array.isArray(state.all)) {
    console.warn('⚠️ state.all was not an array. Reinitializing it.');
    state.all = [];
  }

  state.all.unshift(action.payload);
})



      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchLatestOrders.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchLatestOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recent = action.payload;
      })
      .addCase(fetchLatestOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
