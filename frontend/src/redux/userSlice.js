import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/axios';

export const signInUser = createAsyncThunk(
  'user/signInUser',
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post('/users/signin', credentials);
      localStorage.setItem('loggedIn', 'true');
      return res.data.data.user;
    } catch (err) {
      localStorage.removeItem('loggedIn');
      const message =
        err.response?.data?.message || err.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const signUpUser = createAsyncThunk(
  'user/signUpUser',
  async (formData, thunkAPI) => {
    try {
      const res = await api.post('/users/signup', formData);
      localStorage.setItem('loggedIn', 'true');
      return res.data.data.user;
    } catch (err) {
      localStorage.removeItem('loggedIn');
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const refreshUser = createAsyncThunk(
  'user/refreshUser',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/users/refresh', { withCredentials: true });
      return res.data.data.user;
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('loggedIn');
        return null;
      }
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      await api.post('/users/logout');
      localStorage.removeItem('loggedIn');
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

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
  },
  extraReducers: (builder) => {
    builder
      // signIn
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // signUp
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
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
      })
      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }) // forgot password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;
