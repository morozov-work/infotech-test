import { request } from './request';
import type { TopAuthorsParams, TopAuthorsResponse } from '@/types';

export const getTopAuthors = (params: TopAuthorsParams) => {
  return request<TopAuthorsResponse>('/reports/top-authors', { params });
};
