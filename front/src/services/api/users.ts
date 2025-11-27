import { apiClient } from './apiClient';

export interface SignupRequest {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isResigned: boolean;
}

export interface SignupResponse {
  createdUser: User;
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>('/users/signup', data);

  return response.data;
}
