import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://aftab-backend-6bzw1rpmp-shery1.vercel.app/api',
  withCredentials: true,
})
