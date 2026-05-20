import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { validateSession } from '../services/auth.service';

export const authMiddleware = createMiddleware(async (c, next) => {
  const sessionId = getCookie(c, 'session');

  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const { session, user } = await validateSession(sessionId);

  if (!session || !user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', user);
  c.set('session', session);

  await next();
});
