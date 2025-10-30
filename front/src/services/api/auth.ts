import axios from 'axios';
import { API_BASE_URL } from './config';
import { User } from '@shared/schemas/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

export class AuthApiService {
  static async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/login`,
      data,
      {
        withCredentials: true,
      },
    );

    return response.data;
  }

  static async logout(): Promise<void> {
    await axios.post(
      `${API_BASE_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );
  }
}
