import axios from 'axios';
import config from './api.config';

const interceptor = axios.create({
  baseURL: config.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


const handleLogout = () => {
  localStorage.clear();
  window.location.href = '/';
};


interceptor.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');


    const noAuthRoutes = ['auth/login', '/cadastro', '/cadastro/busca'];


    const isPublicRoute = noAuthRoutes.some(path => config.url?.includes(path));

    if (token && !isPublicRoute) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }


    if (!token && !isPublicRoute) {
       handleLogout();

       return Promise.reject(new Error("Token não encontrado. Redirecionando..."));
    }

    console.log('Request Config:', config);
    return config;
  },
  (error) => Promise.reject(error)
);


interceptor.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

export default interceptor;