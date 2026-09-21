import { login, getUser } from './auth';
import {
  getAutors,
  getAutor,
  createAutor,
  updateAutor,
  deleteAutor,
  subscribeAuthor,
  unsubscribeAuthor,
} from './autors';
import { getBooks, getBook, createBook, updateBook, patchBook, deleteBook } from './books';
import { getTopAuthors } from './reports';

export const api = {
  login,
  getUser,
  subscribeAuthor,
  unsubscribeAuthor,
  getAutors,
  getAutor,
  createAutor,
  updateAutor,
  deleteAutor,
  getBooks,
  getBook,
  createBook,
  updateBook,
  patchBook,
  deleteBook,
  getTopAuthors,
};
