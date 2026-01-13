import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface BlogPost {
  id: string;
  created_at: string;
  title: string;
  content: string;
  user_id: string;
}

interface BlogState {
  posts: BlogPost[];
  loading: boolean;
  editingPost: BlogPost | null;
}

const initialState: BlogState = {
  posts: [],
  loading: false,
  editingPost: null,
};

export const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<BlogPost[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<BlogPost>) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<BlogPost>) => {
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
    setEditingPost: (state, action: PayloadAction<BlogPost | null>) => {
      state.editingPost = action.payload;
    },
  },
});

export const { setPosts, addPost, updatePost, removePost, setLoading, setEditingPost } = blogSlice.actions;

export const selectPosts = (state: RootState) => state.blog.posts;
export const selectLoading = (state: RootState) => state.blog.loading;
export const selectEditingPost = (state: RootState) => state.blog.editingPost;

export default blogSlice.reducer;