/** 统计口径统一为 UTC+8 自然日 */

export function nowIso(): string {
  return new Date().toISOString();
}

/** 任意时间 → UTC+8 自然日 'YYYY-MM-DD' */
export function dayOfUtc8(input: string | Date): string {
  const t = typeof input === 'string' ? new Date(input).getTime() : input.getTime();
  return new Date(t + 8 * 3600_000).toISOString().slice(0, 10);
}

export function todayUtc8(): string {
  return dayOfUtc8(new Date());
}

/** UTC+8 某自然日的起始时刻（UTC ISO，可直接与 created_at 做字符串比较） */
export function dayStartIsoUtc(day: string): string {
  return new Date(`${day}T00:00:00.000+08:00`).toISOString();
}

/** 最近 n 个 UTC+8 自然日（含今天，升序） */
export function recentDaysUtc8(n: number): string[] {
  const today = todayUtc8();
  const startMs = new Date(`${today}T00:00:00.000+08:00`).getTime();
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(dayOfUtc8(new Date(startMs - i * 86400_000)));
  }
  return days;
}

/** 展示用：'YYYY-MM-DD HH:mm'（UTC+8） */
export function formatUtc8(iso: string): string {
  const d = new Date(new Date(iso).getTime() + 8 * 3600_000);
  return d.toISOString().slice(0, 16).replace('T', ' ');
}
