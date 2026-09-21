import { request } from './request';
import type {
  AuthorListParams,
  AuthorListResponse,
  AuthorResponse,
  AuthorInput,
  DeleteResponse,
  ApiResponse,
  User,
} from '@/types';

export const getAutors = (params: AuthorListParams = {}) => {
  return request<AuthorListResponse>('/authors', { params });
};

export const getAutor = (id: number) => {
  return request<AuthorResponse>(`/authors/${id}`);
};

export const createAutor = (body: AuthorInput) => {
  return request<AuthorResponse>('/authors', { method: 'POST', body });
};

export const updateAutor = (id: number, body: AuthorInput) => {
  return request<AuthorResponse>(`/authors/${id}`, { method: 'PUT', body });
};

export const deleteAutor = (id: number) => {
  return request<DeleteResponse>(`/authors/${id}`, { method: 'DELETE' });
};

export const subscribeAuthor = (id: number) => {
  return request<ApiResponse<User>>(`/authors/${id}/subscription`, { method: 'POST' });
};

export const unsubscribeAuthor = (id: number) => {
  return request<ApiResponse<User>>(`/authors/${id}/subscription`, { method: 'DELETE' });
};
