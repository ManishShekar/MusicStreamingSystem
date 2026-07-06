import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, LoginResponse } from "@/types";
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "@/utils/constants";

const loadInitialState = (): AuthState => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const rawUser = localStorage.getItem(USER_STORAGE_KEY);

  if (token && rawUser) {
    try {
      const user = JSON.parse(rawUser) as Omit<LoginResponse, "token">;
      return {
        token,
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        role: user.role,
        isAuthenticated: true,
      };
    } catch {
      // fall through to logged-out state
    }
  }

  return {
    token: null,
    userId: null,
    userName: null,
    email: null,
    role: null,
    isAuthenticated: false,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { token, ...user } = action.payload;
      state.token = token;
      state.userId = user.userId;
      state.userName = user.userName;
      state.email = user.email;
      state.role = user.role;
      state.isAuthenticated = true;

      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.userName = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;

      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
