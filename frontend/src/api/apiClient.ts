import axios from 'axios';
import { store } from '../store/store';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const customAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

customAxios.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('accessToken');
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

customAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Token might be expired.');
    }
    return Promise.reject(error);
  }
);

export default customAxios;
