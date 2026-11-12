import type { FastifyInstance } from 'fastify';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '../db/index.js';
import { adminUsers } from '../db/schema.js';
import { ApiError, parseBody } from '../lib/errors.js';
import { authenticate, verifySameOrigin } from '../lib/auth.js';
import { config } from '../config.js';
import { nowIso } from '../lib/time.js';

const loginSchema = z.object({
  username: z.string().trim().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
});

/** 登录失败锁定记录：连续失败 5 次锁定 10 分钟（单实例内存态） */
const attempts = new Map<string, { count: number; lockUntil: number }>();

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/login',
    { preHandler: verifySameOrigin, config: { rateLimit: { max: 5, timeWindow: '1 minute' } } },
    async (req, reply) => {
      const { username, password } = parseBody(loginSchema, req.body);
      const key = `${req.ip}:${username}`;
      const rec = attempts.get(key);
      if (rec && rec.lockUntil > Date.now()) {
        throw new ApiError(423, 423, `失败次数过多，账号已锁定，请 ${Math.ceil((rec.lockUntil - Date.now()) / 60000)} 分钟后再试`);
      }
      const user = db.select().from(adminUsers).where(eq(adminUsers.username, username)).get();
      const passOk = user ? await bcrypt.compare(password, user.passwordHash) : false;
      if (!user || !passOk) {
        const count = (rec && rec.lockUntil <= Date.now() ? 0 : rec?.count || 0) + 1;
        attempts.set(key, {
          count: count >= 5 ? 0 : count,
          lockUntil: count >= 5 ? Date.now() + 10 * 60_000 : 0,
        });
        throw new ApiError(401, 401, '用户名或密码错误');
      }
      attempts.delete(key);
      db.update(adminUsers).set({ lastLoginAt: nowIso() }).where(eq(adminUsers.id, user.id)).run();
      const token = await reply.jwtSign({ uid: user.id, username: user.username });
      reply.setCookie('rezen_admin_token', token, {
        path: '/',
        httpOnly: true,
        secure: config.cookieSecure,
        sameSite: 'lax',
        maxAge: 7 * 24 * 3600,
      });
      return { code: 0, data: { username: user.username, role: user.role, lastLoginAt: user.lastLoginAt } };
    },
  );

  app.post('/logout', { preHandler: verifySameOrigin }, async (_req, reply) => {
    reply.clearCookie('rezen_admin_token', { path: '/' });
    return { code: 0, data: null };
  });

  app.get('/me', { preHandler: authenticate }, async (req) => {
    const user = db.select().from(adminUsers).where(eq(adminUsers.id, req.user.uid)).get();
    if (!user) throw new ApiError(401, 401, '账号不存在');
    return { code: 0, data: { username: user.username, role: user.role, lastLoginAt: user.lastLoginAt } };
  });
}
