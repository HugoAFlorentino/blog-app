import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/axios';

// CREATE POST
// export const createPost = createAsyncThunk(
//   'blog/createPost',
//   async (credentials, thunkAPI) => {
//     try {
//       const response = await api.post('/blog', credentials, {
//         withCredentials: true,
//       });
//       return response.data.data;
//     } catch (err) {
//       const message =
//         err.response?.data?.error || err.message || 'Something went wrong';
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

// GET ALL POSTS with optional title filter
// export const getAllPosts = createAsyncThunk(
//   'blog/getAllPosts',
//   async (filter = '', thunkAPI) => {
//     try {
//       let url = '/blog';
//       if (filter) {
//         url += `?title=${encodeURIComponent(filter)}`;
//       }
//       const response = await api.get(url);
//       return response.data.data;
//     } catch (err) {
//       const message =
//         err.response?.data?.error || err.message || 'Something went wrong';
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

const demoPostTemplate = {
  title: 'Demo Title by User',
  body: 'This is a predefined demo post content to simulate a user-generated blog post.',
  isDemo: true,
};

// CREATE POST
export const createPost = createAsyncThunk(
  'blog/createPostDemo',
  async (credentials, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.user.currentUser;
      const isDemoUser = !!user?.isDemoUser;

      // If demo user, send demo template ignoring credentials
      const finalPayload = isDemoUser ? demoPostTemplate : credentials;

      const response = await api.post('/blog', finalPayload, {
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
  async (filter = '', thunkAPI) => {
    try {
      let url = '/blog';
      if (filter) {
        url += `?title=${encodeURIComponent(filter)}`;
      }

      const response = await api.get(url, { withCredentials: true });
      const posts = response.data.data;

      const state = thunkAPI.getState();
      const currentUser = state.user.currentUser;
      const isDemoUser = !!currentUser?.isDemoUser;

      const processedPosts = posts.map((post) => {
        if (isDemoUser && post.author?._id === currentUser._id) {
          return {
            ...post,
            title: demoPostTemplate.title,
            body: demoPostTemplate.body,
          };
        }
        return post;
      });

      return processedPosts;
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// UPDATE POST
export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const user = state.user.currentUser;
      const isDemoUser = !!user?.isDemoUser;

      const finalUpdateData = isDemoUser ? demoPostTemplate : updatedData;

      const response = await api.patch(`/blog/${id}`, finalUpdateData, {
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
// // PATCH (update) post
// export const updatePost = createAsyncThunk(
//   'blog/updatePost',
//   async ({ id, updatedData }, thunkAPI) => {
//     try {
//       const response = await api.patch(`/blog/${id}`, updatedData, {
//         withCredentials: true,
//       });
//       return response.data.data;
//     } catch (err) {
//       const message =
//         err.response?.data?.error || err.message || 'Failed to update post';
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

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
        const id = action.payload;
        const index = state.posts.findIndex((p) => p._id === id);
        if (index !== -1) {
          state.posts[index].isDeleted = true;
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
