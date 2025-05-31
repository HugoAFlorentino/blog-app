import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../utils/axios';

// Fetch all users (to be able to filter by author)
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/users', { withCredentials: true });
      return res.data.data; // assuming array of users is here
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
  async (credentials, thunkAPI) => {
    try {
      const res = await api.post('/users/signin', credentials, {
        withCredentials: true,
      });
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
        return thunkAPI.rejectWithValue('Not authenticated');
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

// Update user profile
export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ username, email, isAdmin }, thunkAPI) => {
    try {
      // Send isAdmin if needed (assuming admin only allowed this)
      const res = await api.patch(
        '/users/profile/update',
        { username, email, isAdmin },
        { withCredentials: true }
      );
      return res.data.data; // updated user object
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
      return res.data.message || 'Password changed successfully';
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || 'Failed to change password'
      );
    }
  }
);

// Soft delete user by ID (admin only)
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, thunkAPI) => {
    try {
      const res = await api.patch(`/users/delete/${id}`, null, {
        withCredentials: true,
      });
      return res.data.data; // deleted user data or confirmation
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to delete user'
      );
    }
  }
);

// Restore deleted user by ID (admin only)
export const restoreUser = createAsyncThunk(
  'user/restoreUser',
  async (id, thunkAPI) => {
    try {
      const res = await api.patch(`/users/restore/${id}`, null, {
        withCredentials: true,
      });
      return res.data.data; // restored user data
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to restore user'
      );
    }
  }
);

// GET USER BY ID
export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/users/${id}`, { withCredentials: true });
      return res.data.data; // assuming user data is in data.data
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Failed to fetch user';
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
    viewedUser: null,
    users: [], // <-- all fetched users
    authorFilter: '', // <-- filter string for author
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
      // Fetch all users
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
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (action.payload === 'Not authenticated') {
          state.currentUser = null;
        }
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

        if (state.currentUser?.id === action.payload?.id) {
          state.currentUser = null;
        }

        // Also remove deleted user from users array
        state.users = state.users.filter((u) => u.id !== action.payload?.id);
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

        if (state.currentUser?.id === action.payload?.id) {
          state.currentUser = action.payload;
        }

        // Add restored user back to users array or update it
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
        state.viewedUser = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.viewedUser = action.payload;
        state.error = null;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.viewedUser = null;
      });
  },
});

// Selector to get filtered users by authorFilter
export const selectFilteredUsers = (state) => {
  if (!state.user.authorFilter) return state.user.users;
  return state.user.users.filter((user) =>
    user.username.toLowerCase().includes(state.user.authorFilter.toLowerCase())
  );
};

export const { logout, clearMessage, setAuthorFilter, clearAuthorFilter } =
  userSlice.actions;

export default userSlice.reducer;
