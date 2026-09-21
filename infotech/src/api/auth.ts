import { request } from './request';
import type { LoginRequest, LoginResponse, ApiResponse, User } from '@/types';

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  return request<LoginResponse>('/auth/login', { method: 'POST', body });
};

export const getUser = () => request<ApiResponse<User>>('/auth/user');
