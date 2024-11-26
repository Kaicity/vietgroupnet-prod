import { baseURL } from '../config/environment';
import axios from 'axios';

export const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authContext; // This will hold the Auth context

export const setAuthContext = (context) => {
  authContext = context; // Save the context globally
};

// Interceptor to add the Authorization header with the token
instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');

    // Mọi APIs đều có Header Auth token ngoại trừ Login APIs
    if (token && !config.url.includes('/login')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error(
      'API Error:',
      error.response ? error.response.data.message : error.message,
    );

    const errorMessage = error.response
      ? error.response.data.message
      : 'Network Error';

    // Check for token expiration (example status code)
    if (error.response && error.response.status === 401) {
      // Call logout function from AuthContext
      if (authContext && authContext.logout) {
        authContext.logout();
      }
    }

    // check error network not connect server
    if (errorMessage === 'Network Error') {
      if (authContext && authContext.networkStatus) {
        authContext.networkStatus(false);
        authContext.notConnectedNetwork();
      }
    } else {
      if (authContext && authContext.networkStatus) {
        authContext.networkStatus(true);
      }
    }

    return Promise.reject(errorMessage);
  },
);
