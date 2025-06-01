import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import blogReducer from './blogSlice';
import logsReducer from './logsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogReducer,
    logs: logsReducer,
  },
});

export default store;
