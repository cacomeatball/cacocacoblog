import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../app/store';

export interface CommentPost {
  id: string;
  created_at: string;
  username: string;
  content: string;
  image_url?: string;
  post_id: string;
  user_id: string;
}

interface CommentState {
  posts: CommentPost[];
  loading: boolean;
  editingPost: CommentPost | null;
}

const initialState: CommentState = {
  posts: [],
  loading: false,
  editingPost: null,
};

export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<CommentPost[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<CommentPost>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<CommentPost>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEditingPost: (state, action: PayloadAction<CommentPost | null>) => {
      state.editingPost = action.payload;
    },
  },
});

export const { setPosts, addPost, updatePost, removePost, setLoading, setEditingPost } = commentSlice.actions;

export const selectPosts = (state: RootState) => state.comment.posts;
export const selectLoading = (state: RootState) => state.comment.loading;
export const selectEditingPost = (state: RootState) => state.comment.editingPost;

export default commentSlice.reducer;