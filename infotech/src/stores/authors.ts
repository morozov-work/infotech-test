import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Author, AuthorShort, ListData, AuthorListParams, TopAuthorsData } from '@types';
import { api } from '@api';
import { useUiStore } from './ui';

export const useAuthorsStore = defineStore('authors', () => {
  const ui = useUiStore();

  const author = ref<Author | null>(null);

  const getAuthor = async (id: number) => {
    ui.loading = true;
    try {
      const response = await api.getAutor(id);
      author.value = response.success ? (response.data ?? null) : null;
    } finally {
      ui.loading = false;
    }
  };

  const clearAuthor = () => {
    author.value = null;
  };

  const authors = ref<ListData<AuthorShort> | null>(null);

  const getAuthors = async (params: AuthorListParams = {}) => {
    ui.loading = true;
    try {
      const response = await api.getAutors(params);
      authors.value = response.success ? (response.data ?? null) : null;
    } finally {
      ui.loading = false;
    }
  };

  const clearAuthors = () => {
    authors.value = null;
  };

  const topAuthors = ref<TopAuthorsData | null>(null);

  const getTopAuthors = async (year: number) => {
    ui.loading = true;
    try {
      const response = await api.getTopAuthors({ year });
      topAuthors.value = response.success ? (response.data ?? null) : null;
    } finally {
      ui.loading = false;
    }
  };

  const clearTopAuthors = () => {
    topAuthors.value = null;
  };

  return {
    author,
    getAuthor,
    clearAuthor,
    authors,
    getAuthors,
    clearAuthors,
    topAuthors,
    getTopAuthors,
    clearTopAuthors,
  };
});
