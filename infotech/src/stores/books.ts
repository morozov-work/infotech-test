import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Book, ListData, BookListParams } from '@types';
import { api } from '@api';
import { useUiStore } from './ui';

export const useBooksStore = defineStore('books', () => {
  const ui = useUiStore();

  const book = ref<Book | null>(null);

  const getBook = async (id: number) => {
    ui.loading = true;
    try {
      const response = await api.getBook(id);
      book.value = response.success ? (response.data ?? null) : null;
    } finally {
      ui.loading = false;
    }
  };

  const clearBook = () => {
    book.value = null;
  };

  const books = ref<ListData<Book> | null>(null);

  const getBooks = async (params: BookListParams = {}) => {
    ui.loading = true;
    try {
      const response = await api.getBooks(params);
      books.value = response.success ? (response.data ?? null) : null;
    } finally {
      ui.loading = false;
    }
  };

  const clearBooks = () => {
    books.value = null;
  };

  return { book, getBook, clearBook, books, getBooks, clearBooks };
});
