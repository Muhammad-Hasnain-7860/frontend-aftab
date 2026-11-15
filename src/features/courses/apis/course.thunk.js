import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../app/api/axiosInstance";
export const getAllCourses = createAsyncThunk(
  "courses",
  async (_, { rejectWithValue, getState }) => {
    try {
      const accessToken = getState().auth.accessToken;

      const { data } = await axiosInstance.get("/course", {
        headers: {
          Authorization: `${accessToken}`,
        },
      });

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Something went wrong",
      );
    }
  },
);
