import mockData from '../../mock-data.json';
import type { Author, Book } from '@/types';

const DATABASE_NAME = 'infotech-mock';
const DATABASE_VERSION = 1;
const STORE_NAMES = ['books', 'authors'] as const;

const seed: { books: Book[]; authors: Author[] } = mockData;

/** Открывает базу для инициализации и будущих моковых запросов. */
export function openMockDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    let blocked = false;

    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('books', { keyPath: 'id', autoIncrement: true });
      db.createObjectStore('authors', { keyPath: 'id', autoIncrement: true });
    };

    request.onerror = () => reject(request.error);
    request.onblocked = () => {
      blocked = true;
      reject(new Error('Обновление базы заблокировано другой вкладкой.'));
    };
    request.onsuccess = () => {
      const db = request.result;
      if (blocked) {
        db.close();
        return;
      }
      db.onversionchange = () => db.close();
      resolve(db);
    };
  });
}

/** Заполняет только полностью пустую базу. Все записи добавляются атомарно. */
export async function initializeMockDatabase(): Promise<void> {
  const db = await openMockDatabase();

  try {
    await new Promise<void>((resolve, reject) => {
      // Общая readwrite-транзакция исключает повторную загрузку из другой вкладки.
      const transaction = db.transaction([...STORE_NAMES], 'readwrite');
      let pending = STORE_NAMES.length;
      let hasData = false;
      let writeError: unknown;

      transaction.oncomplete = () => resolve();
      transaction.onabort = () => {
        reject(writeError ?? transaction.error ?? new Error('Инициализация базы отменена.'));
      };

      for (const name of STORE_NAMES) {
        const request = transaction.objectStore(name).count();
        request.onsuccess = () => {
          hasData ||= request.result > 0;
          pending -= 1;
          if (pending > 0 || hasData) return;

          try {
            for (const storeName of STORE_NAMES) {
              const store = transaction.objectStore(storeName);
              for (const record of seed[storeName]) {
                store.add(record);
              }
            }
          } catch (error) {
            writeError = error;
            transaction.abort();
          }
        };
      }
    });
  } finally {
    db.close();
  }
}
