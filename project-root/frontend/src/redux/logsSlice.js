import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/axios';

export const fetchLogs = createAsyncThunk(
  'logs/fetchLogs',
  async ({ page = 1, limit = 50 } = {}, thunkAPI) => {
    try {
      const response = await api.get('/logs', {
        params: { page, limit },
      });
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Something went wrong';
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
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.logs;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalLogs = action.payload.totalLogs;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default logsSlice.reducer;
