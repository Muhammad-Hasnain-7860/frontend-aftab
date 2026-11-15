import { createAsyncThunk } from "@reduxjs/toolkit";

import { axiosInstance } from "../../../app/api/axiosInstance";
export const authRefresh = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/auth/refresh");
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Refresh failed"
      );
    }
  }
);

export const getMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue, getState }) => {
    try {
      const accessToken = getState().auth.accessToken;

      const { data } = await axiosInstance.get("/auth/me", {
        headers: {
          Authorization: `${accessToken}`,
        },
      });

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user"
      );
    }
  }
);