import axios from 'axios';
import config from './api.config';

const interceptor = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


interceptor.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    const noAuthRoutes = ['auth/login', '/cadastro','/cadastro/busca'];

    if (token && config.url && !noAuthRoutes.some(path => config.url?.includes(path))) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('Request Config:', config);
    return config;
  },
  (error) => Promise.reject(error)
);

interceptor.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
    return Promise.reject(error); 
    }
    return Promise.reject(error);
  }
);

export default interceptor;