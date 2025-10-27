import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export class AuthApiService {
  static async loginAsUser(data: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/user/login`,
      data,
      {
        withCredentials: true,
      },
    );

    return response.data;
  }

  static async loginAsAdmin(data: LoginRequest): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/auth/admin/login`,
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
