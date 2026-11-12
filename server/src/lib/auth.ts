import type { FastifyReply, FastifyRequest } from 'fastify';
import { SITE_ORIGIN } from './seo.js';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { uid: number; username: string };
    user: { uid: number; username: string };
  }
}

/** 管理接口鉴权：校验 httpOnly Cookie 中的 JWT */
export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
  } catch {
    return reply.status(401).send({ code: 401, message: '未登录或登录已过期，请重新登录' });
  }
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * 写操作来源校验（CSRF 防护）：
 * 浏览器携带的 Origin / Referer 必须与当前站点同源。
 * curl、服务端调用等不带来源头的请求放行，由鉴权与限流兜底。
 */
export async function verifySameOrigin(req: FastifyRequest, reply: FastifyReply) {
  if (SAFE_METHODS.has(req.method)) return;
  const source = req.headers.origin || req.headers.referer;
  if (!source) return;

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(source);
  } catch {
    return reply.status(403).send({ code: 403, message: '非法请求来源' });
  }

  // 仅比较主机名（忽略端口），兼容本地 Vite 代理与生产反向代理
  const siteHostname = new URL(SITE_ORIGIN).hostname;
  let requestHostname = '';
  try {
    requestHostname = req.headers.host ? new URL(`http://${req.headers.host}`).hostname : '';
  } catch {
    requestHostname = '';
  }
  if (sourceUrl.hostname !== requestHostname && sourceUrl.hostname !== siteHostname) {
    return reply.status(403).send({ code: 403, message: '非法请求来源' });
  }
}
