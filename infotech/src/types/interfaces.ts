import { Role } from '@types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtPayload {
  sub: number;
  username: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface User {
  id?: number;
  username?: string;
  full_name?: string;
  role?: Role;
}

export interface LoginData {
  token?: string;
  expires_at?: string;
  user?: User;
}

export interface Book {
  id?: number;
  title?: string;
  year?: number;
  description?: string;
  isbn?: string;
  cover_url?: string;
  authors?: AuthorShort[];
}

export interface AuthorShort {
  id?: number;
  full_name?: string;
}

export interface Author {
  id?: number;
  full_name?: string;
  books?: BookShort[];
}

export interface BookShort {
  id?: number;
  title?: string;
  year?: number;
}

export interface BookInput {
  title?: string;
  year?: number;
  description?: string;
  isbn?: string;
  author_ids?: number[];
}

export interface BookForm {
  title: string;
  year: number;
  description?: string;
  isbn?: string;
  author_ids: number[];
  cover: File;
}

export interface AuthorInput {
  full_name: string;
}

export interface PaginationParams {
  page?: number;
  'per-page'?: number;
}

export interface BookListParams extends PaginationParams {
  author_id?: number;
  year?: number;
  search?: string;
}

export interface AuthorListParams extends PaginationParams {
  search?: string;
}

export interface TopAuthorsParams {
  year: number;
}

export interface IdParams {
  id: number;
}

export interface Pagination {
  total?: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
}

export interface TopAuthor {
  rank?: number;
  author_id?: number;
  full_name?: string;
  books_count?: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

export interface ListData<T> {
  items?: T[];
  pagination?: Pagination;
}

export interface TopAuthorsData {
  year?: number;
  items?: TopAuthor[];
}

export type LoginResponse = ApiResponse<LoginData>;
export type BookResponse = ApiResponse<Book>;
export type AuthorResponse = ApiResponse<Author>;
export type BookListResponse = ApiResponse<ListData<Book>>;
export type AuthorListResponse = ApiResponse<ListData<AuthorShort>>;
export type TopAuthorsResponse = ApiResponse<TopAuthorsData>;

export type DeleteResponse = void;

export interface ApiError {
  success?: boolean;
  errors?: ErrorItem[];
}

export interface ErrorItem {
  field?: string;
  message?: string;
}
