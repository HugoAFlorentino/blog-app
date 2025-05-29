import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/axios';

// Sign in user
export const signInUser = createAsyncThunk(
  'user/signInUser',
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post('/users/signin', credentials, {
        withCredentials: true,
      });
      // Do NOT store token manually
      return res.data.data.user;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Sign up user
export const signUpUser = createAsyncThunk(
  'user/signUpUser',
  async (formData, thunkAPI) => {
    try {
      const res = await api.post('/users/signup', formData, {
        withCredentials: true,
      });
      return res.data.data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Refresh user (using cookie-based refresh token)
export const refreshUser = createAsyncThunk(
  'user/refreshUser',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/users/refresh', { withCredentials: true });
      return res.data.data.user;
    } catch (err) {
      if (err.response?.status === 401) {
        return null; // User not authenticated
      }
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    try {
      await api.post('/users/logout', null, { withCredentials: true });
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const res = await api.post('/auth/reset-password', { email });
      return (
        res.data.message || 'If the email exists, a reset link has been sent.'
      );
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Something went wrong. Try again later.'
      );
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ id, token, password }, thunkAPI) => {
    try {
      const res = await api.post(`/auth/reset-password/${id}/${token}`, {
        password,
      });
      return res.data.message || 'Password successfully reset.';
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Invalid or expired token.'
      );
    }
  }
);

// Update user (PATCH /users/profile/update)
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ username, email }, thunkAPI) => {
    try {
      const res = await api.patch(
        '/users/profile/update',
        { username, email },
        { withCredentials: true } // Cookies will be sent automatically
      );
      return res.data.data;
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to update user';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // signInUser
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // signUpUser
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // refreshUser
      .addCase(refreshUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentUser = null;
      })

      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // forgotPassword
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // resetPassword
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
        state.message = 'User updated successfully';
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Update failed';
      });
  },
});

export const { logout, clearMessage } = userSlice.actions;
export default userSlice.reducer;
