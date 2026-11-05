import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'https://aftab-backend.vercel.app/api',
  withCredentials: true,
})
