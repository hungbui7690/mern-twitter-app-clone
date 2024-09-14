import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.NODE_ENV !== 'production'
      ? 'http://localhost:5000/api/v1'
      : 'https://mern-twitter-app-clone.onrender.com/api/v1',
})

axiosInstance.defaults.withCredentials = true
