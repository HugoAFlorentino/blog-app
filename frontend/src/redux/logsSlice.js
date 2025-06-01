import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

export const fetchLogs = createAsyncThunk(
  'logs/fetchLogs',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/logs');
      return response.data; // return logs data here
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default logsSlice.reducer;
