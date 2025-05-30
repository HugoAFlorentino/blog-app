import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/axios';

export const createPost = createAsyncThunk(
  'blog/createPost',
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post('/blog', credentials, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  loading: false,
  error: null,
  message: null,
};

// Blog slice
const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
        state.message = 'Post created successfully';
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage } = blogSlice.actions;
export default blogSlice.reducer;
