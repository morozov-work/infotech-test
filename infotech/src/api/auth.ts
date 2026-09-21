import { request } from './request';
import type { LoginRequest, LoginResponse } from '@/types';

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  return request<LoginResponse>('/auth/login', { method: 'POST', body });
};
