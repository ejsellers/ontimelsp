import React, { useEffect } from 'react';
import { List } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import axios from 'axios';

const orderSlice = createSlice({
  name: 'orders',
  initialState: { data: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrderStatus.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

const fetchOrderStatus = createAsyncThunk('orders/fetchOrderStatus', async (orderId) => {
  const response = await axios.get(`api/orderStatusChanges/${orderId}`);
  return response.data;
});

const store = configureStore({
  reducer: orderSlice.reducer,
  devTools: process.env.NODE_ENV !== 'production',
});

function App() {
  const orders = useSelector((state) => state.orders.data);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrderStatus(1)); // Replace 1 with the actual orderId
  }, [dispatch]);

  return (
    <List
      header={<div>Order Status</div>}
      bordered
      dataSource={orders}
      renderItem={(item) => (
        <List.Item>
          {item.status} - {item.updatedAt}
        </List.Item>
      )}
    />
  );
}

export default App;
