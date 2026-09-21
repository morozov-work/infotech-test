import { useAuthStore } from '@/stores';
import { request } from './request';
import type { LoginRequest, LoginResponse } from '@/types';

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const store = useAuthStore();
  const response = await request<LoginResponse>('/auth/login', { method: 'POST', body });
  store.accessToken = response.data?.token ?? null;
  return response;
};

export const logout = async (body: LoginRequest): Promise<LoginResponse> => {
  const store = useAuthStore();
  const response = await request<LoginResponse>('/auth/login', { method: 'POST', body });
  store.accessToken = response.data?.token ?? null;
  return response;
};
