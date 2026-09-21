import { getRecords, saveRecord, deleteRecord, setSubscription } from '@/db/requests';
import { createSession, verifyToken, publicUser } from '@/db/auth';
import { useAuthStore } from '@/stores/auth';
import type {
  AuthorInput,
  Book,
  BookForm,
  BookInput,
  BookListParams,
  LoginRequest,
  PaginationParams,
} from '@/types';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: LoginRequest | AuthorInput | BookInput | BookForm;
  params?: BookListParams;
}

function paginate<T>(items: T[], params: PaginationParams) {
  const per_page = 10;
  const total_pages = Math.ceil(items.length / per_page);
  const page = Math.min(
    Math.max(1, Math.trunc(Number(params.page) || 1)),
    Math.max(1, total_pages),
  );
  return {
    items: items.slice((page - 1) * per_page, page * per_page),
    pagination: {
      total: items.length,
      page,
      per_page,
      total_pages,
    },
  };
}

function readCover(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/** Имитирует запрос: возвращает данные из IndexedDB в формате ответа API. */
export async function request<T>(
  path: string,
  { method = 'GET', body, params = {} }: RequestOptions = {},
): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const respond = (data: unknown) => ({ success: true, data }) as T;
  if (path === '/auth/login' && method === 'POST') {
    return respond(await createSession(body as LoginRequest));
  }

  const subscription = path.match(/^\/authors\/(\d+)\/subscription$/);
  if (path === '/auth/user' || subscription) {
    if (
      (subscription && method !== 'POST' && method !== 'DELETE') ||
      (!subscription && method !== 'GET')
    ) {
      throw Object.assign(new Error('Метод не поддерживается'), { status: 405 });
    }
    const payload = await verifyToken(useAuthStore().accessToken);
    if (!payload) throw Object.assign(new Error('Необходима авторизация'), { status: 401 });
    const user = (await getRecords('users')).find((item) => item.id === payload.sub);
    if (!user) throw Object.assign(new Error('Пользователь не найден'), { status: 404 });
    if (!subscription) return respond(publicUser(user));
    const authorId = Number(subscription[1]);
    if (!(await getRecords('authors')).some((author) => author.id === authorId)) {
      throw Object.assign(new Error('Автор не найден'), { status: 404 });
    }
    return respond(publicUser(await setSubscription(payload.sub, authorId, method !== 'DELETE')));
  }

  if (method !== 'GET') {
    const session = await verifyToken(useAuthStore().accessToken);
    if (!session) throw Object.assign(new Error('Необходима авторизация'), { status: 401 });
    if (session.role !== 'user')
      throw Object.assign(new Error('Недостаточно прав'), { status: 403 });
  }

  const [, resource, rawId] = path.split('/');
  const id = rawId === undefined ? undefined : Number(rawId);
  const search = params.search?.trim().toLocaleLowerCase() ?? '';

  if (resource === 'books') {
    const books = await getRecords('books');
    const book = books.find((item) => item.id === id);
    if (method === 'GET') {
      return respond(
        id !== undefined
          ? book
          : paginate(
              books.filter(
                (item) =>
                  (item.title ?? '').toLocaleLowerCase().includes(search) &&
                  (params.year === undefined || item.year === params.year) &&
                  (params.author_id === undefined ||
                    item.authors?.some((author) => author.id === params.author_id)),
              ),
              params,
            ),
      );
    }
    if (method === 'DELETE') {
      await deleteRecord('books', id!);
      return undefined as T;
    }
    const { author_ids, ...fields } = body as BookInput;
    const record: Book = method === 'PATCH' ? { ...book } : { description: '', isbn: '' };
    if (id !== undefined) record.id = id;
    // File передаётся отдельно, в запись книги попадают только поля модели.
    for (const key of ['title', 'year', 'description', 'isbn'] as const) {
      if (fields[key] !== undefined) Object.assign(record, { [key]: fields[key] });
    }
    if (author_ids !== undefined) {
      record.authors = (await getRecords('authors'))
        .filter((author) => author_ids.includes(author.id!))
        .map(({ id, full_name }) => ({ id, full_name }));
    }
    if (method !== 'PATCH') record.cover_url = await readCover((body as BookForm).cover);
    return respond(await saveRecord('books', record));
  }

  if (resource === 'authors') {
    const authors = await getRecords('authors');
    const author = authors.find((item) => item.id === id);
    if (method === 'GET')
      return respond(
        id !== undefined
          ? author
          : paginate(
              authors
                .filter((item) => (item.full_name ?? '').toLocaleLowerCase().includes(search))
                .map(({ id, full_name }) => ({ id, full_name })),
              params,
            ),
      );
    if (method === 'DELETE') {
      await deleteRecord('authors', id!);
      return undefined as T;
    }
    return respond(
      await saveRecord('authors', {
        ...author,
        full_name: (body as AuthorInput).full_name,
        books: author?.books ?? [],
      }),
    );
  }

  if (path === '/reports/top-authors') {
    const [books, authors] = await Promise.all([getRecords('books'), getRecords('authors')]);
    const items = authors
      .map((author) => ({
        author_id: author.id,
        full_name: author.full_name,
        books_count: books.filter(
          (book) =>
            book.year === params.year && book.authors?.some((item) => item.id === author.id),
        ).length,
      }))
      .filter((author) => author.books_count > 0)
      .sort((a, b) => b.books_count - a.books_count || a.author_id! - b.author_id!)
      .slice(0, 10)
      .map((author, index) => ({ ...author, rank: index + 1 }));
    return respond({ year: params.year, items });
  }
  return undefined as T;
}
