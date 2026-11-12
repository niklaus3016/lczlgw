import type { z } from 'zod';

/** 业务错误：携带 HTTP 状态码与业务 code，由全局错误处理器统一输出 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: number,
    message: string,
  ) {
    super(message);
  }
}

/** Zod 校验请求体，失败时抛出可读的首条错误信息 */
export function parseBody<S extends z.ZodTypeAny>(schema: S, body: unknown): z.output<S> {
  const result = schema.safeParse(body);
  if (!result.success) {
    const issue = result.error.issues[0];
    const where = issue && issue.path.length ? `${issue.path.join('.')}: ` : '';
    throw new ApiError(400, 400, issue ? `${where}${issue.message}` : '请求参数不合法');
  }
  return result.data;
}
