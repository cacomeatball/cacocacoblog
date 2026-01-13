import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, Session } from '@supabase/supabase-js';
import type { RootState } from '../../app/store';

interface AuthState {
  user: User | null;
  session: Session | null;
}

const initialState: AuthState = {
  user: null,
  session: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ user: User | null; session: Session | null }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
    },
    clearSession: (state) => {
      state.user = null;
      state.session = null;
    },
  },
});

export const { setSession, clearSession } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const selectSession = (state: RootState) => state.auth.session;

export default authSlice.reducer;