
import { createSlice } from "@reduxjs/toolkit";
import { getDashboardStats } from "../apis/dashboardthunk";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    stats: {
      totalStudents: 0,
      totalLectures: 0,
      todaySession: 0,
      pendingSubmissions: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled , (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected , (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
