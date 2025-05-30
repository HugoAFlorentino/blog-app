import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/axios';

// CRETE POST
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

// GET ALL POSTS
export const getAllPosts = createAsyncThunk(
  '/blog/getPosts',
  async (thunkAPI) => {
    try {
      const response = await api.get('/blog');
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET POST BY ID
export const getPostById = createAsyncThunk(
  'blog/getPostById',
  async (id, thunkAPI) => {
    try {
      const response = await api.get(`/blog/${id}`);
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
    builder // CREATE POST
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
      }) // GET ALL POSTS
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.message = 'Posts fetched successfully';
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // GET POST BY ID
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
        state.error = null;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage } = blogSlice.actions;
export default blogSlice.reducer;
