import { request } from './request';
import type {
  AuthorListParams,
  AuthorListResponse,
  AuthorResponse,
  AuthorInput,
  DeleteResponse,
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
