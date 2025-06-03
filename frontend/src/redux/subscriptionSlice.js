import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/axios';

export const sendThankYouEmail = createAsyncThunk(
  'subscription/sendThankYouEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/subscription/thank-you', { email });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendThankYouEmail.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(sendThankYouEmail.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(sendThankYouEmail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to send thank you email';
      });
  },
});

export default subscriptionSlice.reducer;
