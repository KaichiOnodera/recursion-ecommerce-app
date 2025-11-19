import axios from 'axios';
import { API_BASE_URL } from './config';

const createApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return client;
};

export const apiClient = createApiClient();
