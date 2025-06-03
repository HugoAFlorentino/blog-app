import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import blogReducer from './blogSlice';
import logsReducer from './logsSlice';
import subscriptionReducer from './subscriptionSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogReducer,
    logs: logsReducer,
    subscription: subscriptionReducer,
  },
});

export default store;
