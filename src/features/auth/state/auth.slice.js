import { createSlice } from "@reduxjs/toolkit";
import { authRefresh, getMe } from "../apis/auth.thunk";

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  isAuthenticated: false,
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
    },
  },

  reducers : {
    updateUser : (state , action)=>{
      state.user = action.payload
    }
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
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;      
        state.error = action.payload;
      });
  },
});

export const {updateUser} = authSlice.actions

export const { logout } = authSlice.actions;
export default authSlice.reducer;