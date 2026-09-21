import { openMockDatabase } from './index';
import type { Author, Book } from '@/types';

type Tables = { books: Book; authors: Author };
type Table = keyof Tables;

async function transaction<T>(
  mode: IDBTransactionMode,
  run: (tx: IDBTransaction, done: (value: T) => void) => void,
): Promise<T> {
  const db = await openMockDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['books', 'authors'], mode);
    let value: T;
    tx.oncomplete = () => {
      db.close();
      resolve(value);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
    run(tx, (result) => {
      value = result;
    });
  });
}

// После изменения записи обновляем связи в обеих таблицах той же транзакцией.
function syncRelations(tx: IDBTransaction) {
  const bookStore = tx.objectStore('books');
  const authorStore = tx.objectStore('authors');
  const bookRequest = bookStore.getAll();
  const authorRequest = authorStore.getAll();
  authorRequest.onsuccess = () => {
    const books: Book[] = bookRequest.result;
    const authors: Author[] = authorRequest.result;
    for (const book of books) {
      book.authors = (book.authors ?? []).flatMap(({ id }) => {
        const author = authors.find((item) => item.id === id);
        return author ? [{ id: author.id, full_name: author.full_name }] : [];
      });
      bookStore.put(book);
    }
    for (const author of authors) {
      author.books = books
        .filter((book) => book.authors?.some((item) => item.id === author.id))
        .map(({ id, title, year }) => ({ id, title, year }));
      authorStore.put(author);
    }
  };
}

export function getRecords<K extends Table>(table: K): Promise<Tables[K][]> {
  return transaction('readonly', (tx, done) => {
    const request = tx.objectStore(table).getAll();
    request.onsuccess = () => done(request.result);
  });
}

export function saveRecord<K extends Table>(table: K, record: Tables[K]): Promise<Tables[K]> {
  return transaction('readwrite', (tx, done) => {
    const request = tx.objectStore(table).put(record);
    request.onsuccess = () => {
      syncRelations(tx);
      done({ ...record, id: Number(request.result) });
    };
  });
}

export function deleteRecord(table: Table, id: number): Promise<void> {
  return transaction('readwrite', (tx, done) => {
    const request = tx.objectStore(table).delete(id);
    request.onsuccess = () => {
      syncRelations(tx);
      done();
    };
  });
}
