import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  userId: string | null;
  isLoggedIn: boolean;
}

const savedAuth = localStorage.getItem("auth");
const parsedAuth: AuthState | null = savedAuth ? JSON.parse(savedAuth) : null;

const initialState: AuthState = parsedAuth ?? {
  accessToken: null,
  userId: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ accessToken: string; userId: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.userId = action.payload.userId;
      state.isLoggedIn = true;

      localStorage.setItem("auth", JSON.stringify(state));
    },
    logout: (state) => {
      state.accessToken = null;
      state.userId = null;
      state.isLoggedIn = false;

      localStorage.setItem("auth", JSON.stringify(state));
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
