import { openMockDatabase } from './index';
import type { Author, Book, User } from '@/types';

type Tables = { books: Book; authors: Author; users: User & { password: string } };
type Table = keyof Tables;

async function transaction<T>(
  mode: IDBTransactionMode,
  run: (tx: IDBTransaction, done: (value: T) => void) => void,
  tables: Table[] = ['books', 'authors'],
): Promise<T> {
  const db = await openMockDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(tables, mode);
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
  return transaction(
    'readonly',
    (tx, done) => {
      const request = tx.objectStore(table).getAll();
      request.onsuccess = () => done(request.result);
    },
    [table],
  );
}

export function saveRecord<K extends 'books' | 'authors'>(
  table: K,
  record: Tables[K],
): Promise<Tables[K]> {
  return transaction('readwrite', (tx, done) => {
    const request = tx.objectStore(table).put(record);
    request.onsuccess = () => {
      syncRelations(tx);
      done({ ...record, id: Number(request.result) });
    };
  });
}

export function deleteRecord(table: 'books' | 'authors', id: number): Promise<void> {
  return transaction(
    'readwrite',
    (tx, done) => {
      const request = tx.objectStore(table).delete(id);
      request.onsuccess = () => {
        syncRelations(tx);
        if (table === 'authors') {
          const users = tx.objectStore('users');
          const cursor = users.openCursor();
          cursor.onsuccess = () => {
            const user = cursor.result;
            if (!user) return;
            user.update({
              ...user.value,
              subscriptions: (user.value.subscriptions ?? []).filter(
                (authorId: number) => authorId !== id,
              ),
            });
            user.continue();
          };
        }
        done();
      };
    },
    ['books', 'authors', 'users'],
  );
}

export function setSubscription(
  userId: number,
  authorId: number,
  subscribed: boolean,
): Promise<User> {
  return transaction(
    'readwrite',
    (tx, done) => {
      const users = tx.objectStore('users');
      const request = users.get(userId);
      request.onsuccess = () => {
        const user = request.result;
        const subscriptions = new Set<number>(user.subscriptions ?? []);
        if (subscribed) subscriptions.add(authorId);
        else subscriptions.delete(authorId);
        user.subscriptions = [...subscriptions];
        users.put(user);
        done(user);
      };
    },
    ['users'],
  );
}
