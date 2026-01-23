import axios from 'axios';
import { API_BASE_URL } from './config';
import { redirectService } from '../redirectService';

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
      // 401エラーの場合、リダイレクトサービスで処理
      if (error.response?.status === 401) {
        const currentPath = window.location.pathname;
        redirectService.handleAuthRequired(currentPath);

        // リダイレクト中であることを示すため、Promiseをpendingのままにする
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return new Promise(() => {});
      }

      return Promise.reject(error);
    },
  );

  return client;
};

export const apiClient = createApiClient();
