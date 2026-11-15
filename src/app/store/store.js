import { configureStore } from '@reduxjs/toolkit'
import courseSlice from '../../features/courses/state/course.slice'
import dashboardSlice from '../../features/dashboardAdmin/state/dashboard.slice'
import authSlice from '../../features/auth/state/auth.slice'
export const store = configureStore({
  reducer: {
  courses: courseSlice,
  dashboard: dashboardSlice,
  auth : authSlice
}
})
