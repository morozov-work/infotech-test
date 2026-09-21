import { request } from './request';
import type {
  BookListParams,
  BookListResponse,
  BookResponse,
  BookForm,
  BookInput,
  DeleteResponse,
} from '@/types';

export const getBooks = (params: BookListParams = {}) => {
  return request<BookListResponse>('/books', { params });
};

export const getBook = (id: number) => {
  return request<BookResponse>(`/books/${id}`);
};

export const createBook = (body: BookForm) => {
  return request<BookResponse>('/books', { method: 'POST', body });
};

export const updateBook = (id: number, body: BookForm) => {
  return request<BookResponse>(`/books/${id}`, { method: 'PUT', body });
};

export const patchBook = (id: number, body: BookInput) => {
  return request<BookResponse>(`/books/${id}`, { method: 'PATCH', body });
};

export const deleteBook = (id: number) => {
  return request<DeleteResponse>(`/books/${id}`, { method: 'DELETE' });
};
