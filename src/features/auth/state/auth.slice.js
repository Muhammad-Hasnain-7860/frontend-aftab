import { createSlice } from "@reduxjs/toolkit";
import { authRefresh, getMe } from "../apis/auth.thunk";

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  isAuthenticated: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.initialized = true;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = Boolean(action.payload);
      state.initialized = true;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Refresh
      .addCase(authRefresh.pending, (state) => {
        state.loading = true;
      })
      .addCase(authRefresh.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(authRefresh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.initialized = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.initialized = true;
        state.error = action.payload;
      });
  },
});

export const { updateUser, logout } = authSlice.actions;
export default authSlice.reducer;