import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/auth/authSlice";
import playerReducer from "@/redux/player/playerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
