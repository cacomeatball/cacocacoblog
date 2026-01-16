import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import blogReducer from '../features/blog/blogSlice';
import commentReducer from '../features/blog/post/comment/commentSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    blog: blogReducer,
    comment: commentReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;