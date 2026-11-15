import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../app/api/axiosInstance";

export const getDashboardStats = createAsyncThunk(
  "dashboard/thunk",
  async (courseId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(
        `/common/dashboard-stats/${courseId}`
      );

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || error.message || error
      );
    }
  }
);

