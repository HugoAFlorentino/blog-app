import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import blogReducer from './blogSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogReducer,
  },
});

export default store;
