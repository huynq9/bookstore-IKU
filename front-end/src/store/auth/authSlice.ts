import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: null,
    token: null,
    error: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      state.error = null;
      state.isLoggedIn = true;
    },
    loginFailure: (state, action) => {
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    registerFailure: (state, action) => {
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const {
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  logout,
} = authSlice.actions;
export default authSlice;
export const selectUserData = (state: RootState) => state.auth;
