import axios from "axios";
import { authRefresh } from "../../features/auth/apis/auth.thunk";

export const axiosInstance = axios.create({
  baseURL: "https://aftab-backend.ethiodeploy.app/api",
  withCredentials: true,
});

export const setupInterceptors = (store) => {
  // Request interceptor
  axiosInstance.interceptors.request.use((config) => {
    const accessToken = store.getState().auth.accessToken;

    if (accessToken) {
      config.headers.Authorization = `${accessToken}`;
    }

    return config;
  });

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/refresh")
      ) {
        originalRequest._retry = true;

        try {
          const accessToken = await store.dispatch(authRefresh()).unwrap();

          originalRequest.headers.Authorization = `${accessToken}`;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};