import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  userId: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ accessToken: string; userId: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.userId = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
