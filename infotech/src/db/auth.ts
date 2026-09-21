import { SignJWT, jwtVerify } from 'jose';
import type { JwtPayload, LoginRequest, LoginData, Role } from '@/types';
import { getRecords } from './requests';

// jose требует ключ в виде байтов
const SECRET_KEY = new TextEncoder().encode('infotech-mock-jwt-secret');

// Время жизни токена 24 часа в секундах
const TOKEN_EXP = 60 * 60 * 24;

// Собираем токен
export async function createSession({ username, password }: LoginRequest): Promise<LoginData> {
  // ищем совпадение по логину и паролю.
  const users = await getRecords('users');
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) throw Object.assign(new Error('Неверный логин или пароль'), { status: 401 });

  // Момент истечения токена в секундах
  const exp = Math.floor(Date.now() / 1000) + TOKEN_EXP;

  // Собираем токен
  const token = await new SignJWT({ username: user.username, role: user.role }) // кастомные поля
    .setProtectedHeader({ alg: 'HS256' }) // алгоритм SHA-256
    .setSubject(String(user.id)) // sub
    .setIssuedAt() // iat
    .setExpirationTime(exp) // exp
    .sign(SECRET_KEY); // подписываем, на выходе header.payload.signature

  return {
    token,
    expires_at: new Date(exp * 1000).toISOString(), // Date - миллисекунды, поэтому * 1000
    user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role }, // пароль наружу не отдаём
  };
}

// Проверка токена
export async function verifyToken(token: string | null): Promise<JwtPayload | null> {
  // Токена нет - пользователь не залогинен
  if (!token) return null;

  try {
    // jwtVerify кидает исключение, которое ловит catch ниже
    const { payload } = await jwtVerify(token, SECRET_KEY, { algorithms: ['HS256'] });
    const { sub, username, role, iat, exp } = payload;
    // записали id как строку, возвращаем число
    const id = Number(sub);

    // Собираем payload в формате, который ожидает остальной код
    return {
      sub: id,
      username: username as string,
      role: role as Role,
      iat: iat as number,
      exp: exp as number,
    };
  } catch {
    // Любая ошибка означает не авторизован
    return null;
  }
}
