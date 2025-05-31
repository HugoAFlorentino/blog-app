import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/axios';

// CREATE POST
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
  'blog/getAllPosts',
  async (_, thunkAPI) => {
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

// PATCH (update) post (includes adminOnly flag update)
export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ id, updates }, thunkAPI) => {
    try {
      const response = await api.patch(`/blog/${id}`, updates, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Failed to update post';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// SOFT DELETE post (POST /blog/:id)
export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (id, thunkAPI) => {
    try {
      await api.post(`/blog/${id}`, null, { withCredentials: true });
      return id;
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Failed to delete post';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// RESTORE post (PATCH /blog/restore/:id)
export const restorePost = createAsyncThunk(
  'blog/restorePost',
  async (id, thunkAPI) => {
    try {
      const response = await api.patch(`/blog/restore/${id}`, null, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Failed to restore post';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Initial state
const initialState = {
  posts: [],
  currentPost: null,
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
      // CREATE POST
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
      })

      // GET ALL POSTS
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
      })

      // GET POST BY ID
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
      })

      // UPDATE POST
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const updatedPost = action.payload;
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }
        if (state.currentPost?._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }
        state.message = 'Post updated successfully';
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update post';
      })

      // DELETE POST (soft delete)
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        // Mark the post as deleted in state (soft delete)
        const id = action.payload;
        const index = state.posts.findIndex((p) => p._id === id);
        if (index !== -1) {
          state.posts[index].deleted = true; // Assuming API marks deleted posts with a "deleted" flag
        }
        if (state.currentPost?._id === id) {
          state.currentPost.deleted = true;
        }
        state.message = 'Post deleted successfully';
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // RESTORE POST
      .addCase(restorePost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(restorePost.fulfilled, (state, action) => {
        state.loading = false;
        const restoredPost = action.payload;
        const index = state.posts.findIndex((p) => p._id === restoredPost._id);
        if (index !== -1) {
          state.posts[index] = restoredPost;
        }
        if (state.currentPost?._id === restoredPost._id) {
          state.currentPost = restoredPost;
        }
        state.message = 'Post restored successfully';
      })
      .addCase(restorePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearMessage } = blogSlice.actions;
export default blogSlice.reducer;
