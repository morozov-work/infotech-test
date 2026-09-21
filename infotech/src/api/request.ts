import { getRecords, saveRecord, deleteRecord } from '@/db/requests';
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

function paginate<T>(items: T[], { page = 1, 'per-page': per_page = 20 }: PaginationParams) {
  return {
    items: items.slice((page - 1) * per_page, page * per_page),
    pagination: {
      total: items.length,
      page,
      per_page,
      total_pages: Math.ceil(items.length / per_page),
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
  if (path === '/auth/login') {
    return respond({
      token: 'mock-token',
      expires_at: new Date(Date.now() + 86400000).toISOString(),
      user: { id: 1, username: (body as LoginRequest).username, role: 'user' },
    });
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
    const record: Book = method === 'PATCH' ? { ...book } : { id, description: '', isbn: '' };
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
        id,
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
