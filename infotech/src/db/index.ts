import mockData from '../../mock-data.json';
import type { Author, Book, User } from '@/types';

const DATABASE_NAME = 'infotech-mock';
const DATABASE_VERSION = 1;

// Начальные данные из JSON. Каждая таблица заполняется отдельно.
const seed: { books: Book[]; authors: Author[]; users: User[] } = mockData;

// Превращает IndexedDB-запрос в промис, чтобы писать через await.
function toPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Открывает базу. При первом запуске или смене версии создаёт таблицы. */
export function openMockDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    let blocked = false;

    // Вызывается только когда базы нет или версия выросла: здесь создаём таблицы.
    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains('books')) {
        db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('authors')) {
        db.createObjectStore('authors', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onerror = () => reject(request.error);

    // Обновление ждёт, пока другая вкладка закроет старое соединение.
    request.onblocked = () => {
      blocked = true;
      reject(new Error('Обновление базы заблокировано другой вкладкой.'));
    };

    request.onsuccess = () => {
      const db = request.result;

      // Если мы уже отказали по blocked, соединение никому не нужно: закрываем его.
      if (blocked) {
        db.close();
        return;
      }

      // Если другая вкладка захочет обновить базу, не мешаем ей.
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}

/** Заполняет пустые таблицы (books, authors, users) начальными данными. */
export async function initializeMockDatabase(): Promise<void> {
  const db = await openMockDatabase();

  try {
    // Одна общая транзакция на все три таблицы: параллельная вкладка
    // не сможет вставить те же данные второй раз.
    const transaction = db.transaction(['books', 'authors', 'users'], 'readwrite');

    // Промис завершения транзакции создаём сразу, чтобы не пропустить событие.
    const done = new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error ?? new Error('Инициализация отменена.'));
    });

    const books = transaction.objectStore('books');
    const authors = transaction.objectStore('authors');
    const users = transaction.objectStore('users');

    // Считаем записи в каждой таблице.
    const booksCount = await toPromise(books.count());
    const authorsCount = await toPromise(authors.count());
    const usersCount = await toPromise(users.count());

    // Заполняем только те таблицы, которые пусты.
    if (booksCount === 0) seed.books.forEach((book) => books.add(book));
    if (authorsCount === 0) seed.authors.forEach((author) => authors.add(author));
    if (usersCount === 0) seed.users.forEach((user) => users.add(user));

    // Ждём, пока транзакция реально запишет данные.
    await done;
  } finally {
    db.close();
  }
}
