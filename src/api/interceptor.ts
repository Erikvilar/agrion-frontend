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
    window.location.href = '/agrion/';
};

interceptor.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const noAuthRoutes = ['auth/login', '/cadastro', '/cadastro/busca'];
        const isPublicRoute = noAuthRoutes.some(path => config.url?.includes(path));

        if (token && !isPublicRoute) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

interceptor.interceptors.response.use(
    (response) => response,
    (error) => {

        const backendError = error.response?.data;


        const isLoginRoute = error.config?.url?.includes('auth/login');

        if ((error.response?.status === 401 || error.response?.status === 403) && !isLoginRoute) {
            handleLogout();
        }


        const formattedError = {
            status: error.response?.status || 500,
            error: backendError?.error || "Erro interno",
            message: backendError?.message || "Ocorreu um erro inesperado no servidor.",
            timestamp: backendError?.timestamp
        };


        return Promise.reject(formattedError);
    }
);

export default interceptor;