import { login } from './auth';
import { getAutors, getAutor, createAutor, updateAutor, deleteAutor } from './autors';
import { getBooks, getBook, createBook, updateBook, patchBook, deleteBook } from './books';
import { getTopAuthors } from './reports';

export const api = {
  login,
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
