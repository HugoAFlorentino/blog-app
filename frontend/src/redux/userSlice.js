import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/axios';

// Helper to handle API responses according to your backend standard
const handleApiResponse = (res, thunkAPI) => {
  if (res.data.status === 'success') {
    return res.data.data;
  } else {
    return thunkAPI.rejectWithValue(
      res.data.error || res.data.message || 'Unknown error'
    );
  }
};

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async ({ includeDeleted = false } = {}, thunkAPI) => {
    try {
      const res = await api.get('/users', {
        withCredentials: true,
        params: { includeDeleted },
      });
      return handleApiResponse(res, thunkAPI);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch users'
      );
    }
  }
);

// Sign in user
export const signInUser = createAsyncThunk(
  'user/signInUser',
  async ({ email, password, recaptchaToken }, thunkAPI) => {
    try {
      const res = await api.post(
        '/users/signin',
        { email, password, recaptchaToken },
        { withCredentials: true }
      );
      const data = await handleApiResponse(res, thunkAPI);
      return data.user; // user inside data
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Something went wrong'
      );
    }
  }
);

// Sign up user
export const signUpUser = createAsyncThunk(
  'user/signUpUser',
  async ({ username, email, password, recaptchaToken }, thunkAPI) => {
    try {
      const res = await api.post(
        '/users/signup',
        { username, email, password, recaptchaToken },
        { withCredentials: true }
      );
      const data = await handleApiResponse(res, thunkAPI);
      return data.user;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Sign up failed'
      );
    }
  }
);

// Refresh user
export const refreshUser = createAsyncThunk(
  'user/refreshUser',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/users/refresh', { withCredentials: true });
      const data = await handleApiResponse(res, thunkAPI);
      return data.user;
    } catch (err) {
      if (err.response?.status === 401) {
        return thunkAPI.rejectWithValue('Not authenticated');
      }
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to refresh user'
      );
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    try {
      const res = await api.post('/users/logout', null, {
        withCredentials: true,
      });
      return handleApiResponse(res, thunkAPI);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Logout failed'
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
      if (res.data.status === 'success') {
        return (
          res.data.message || 'If the email exists, a reset link has been sent.'
        );
      } else {
        return thunkAPI.rejectWithValue(
          res.data.error ||
            res.data.message ||
            'Failed to send reset password email.'
        );
      }
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
      if (res.data.status === 'success') {
        return res.data.message || 'Password successfully reset.';
      } else {
        return thunkAPI.rejectWithValue(
          res.data.error || res.data.message || 'Invalid or expired token.'
        );
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Invalid or expired token.'
      );
    }
  }
);

// Update user profile
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ username, email, isAdmin }, thunkAPI) => {
    try {
      const res = await api.patch(
        '/users/profile/update',
        { username, email, isAdmin },
        { withCredentials: true }
      );
      const data = await handleApiResponse(res, thunkAPI);
      return data; // updated user object
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          'Failed to update user'
      );
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      const res = await api.patch(
        '/users/change-password',
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      if (res.data.status === 'success') {
        return res.data.message || 'Password changed successfully';
      } else {
        return thunkAPI.rejectWithValue(
          res.data.error || res.data.message || 'Failed to change password'
        );
      }
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to change password'
      );
    }
  }
);

// Soft delete user by ID
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, thunkAPI) => {
    try {
      const res = await api.patch(`/users/delete/${id}`, null, {
        withCredentials: true,
      });
      const data = await handleApiResponse(res, thunkAPI);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to delete user'
      );
    }
  }
);

// Restore deleted user by ID
export const restoreUser = createAsyncThunk(
  'user/restoreUser',
  async (id, thunkAPI) => {
    try {
      const res = await api.patch(`/users/restore/${id}`, null, {
        withCredentials: true,
      });
      const data = await handleApiResponse(res, thunkAPI);
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to restore user'
      );
    }
  }
);

// Get user by ID
export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/users/${id}`, { withCredentials: true });
      return handleApiResponse(res, thunkAPI);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch user'
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
    viewedUser: null,
    users: [],
    authorFilter: '',
    authChecked: false,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    },
    clearMessage: (state) => {
      state.message = null;
      state.error = null;
    },
    setAuthorFilter: (state, action) => {
      state.authorFilter = action.payload;
    },
    clearAuthorFilter: (state) => {
      state.authorFilter = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
        state.currentUser = action.payload;
        state.authChecked = true;
        state.error = null;
        state.loading = false;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.currentUser = null;
        state.authChecked = true;
        state.loading = false;
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
      })

      // changePassword
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = 'User deleted successfully';
        state.error = null;
        const idx = state.users.findIndex(
          (u) => u && u._id === action.payload?._id
        );
        if (idx !== -1) {
          state.users[idx] = action.payload;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete user';
      })

      // restoreUser
      .addCase(restoreUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = 'User restored successfully';
        state.error = null;
        const idx = state.users.findIndex((u) => u.id === action.payload?.id);
        if (idx !== -1) {
          state.users[idx] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(restoreUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to restore user';
      })

      // getUserById
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.viewedUser = action.payload;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearMessage, setAuthorFilter, clearAuthorFilter } =
  userSlice.actions;
export default userSlice.reducer;
