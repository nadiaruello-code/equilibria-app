export type Plan = 'free' | 'starter' | 'premium' | 'circle';

const DAY_MS = 24 * 60 * 60 * 1000;

export function normalizePlan(plan: string | null | undefined): Plan {
  const value = String(plan || 'free').trim().toLowerCase();
  if (value === 'starter' || value === 'premium' || value === 'circle') return value;
  return 'free';
}

export function getPlanLimit(plan: string | null | undefined) {
  const normalized = normalizePlan(plan);
  if (normalized === 'free') return 1;
  if (normalized === 'starter') return 7;
  return 42;
}

export function getUnlockedDay(startedAt: string | Date | null | undefined, plan: string | null | undefined, now = new Date()) {
  const limit = getPlanLimit(plan);
  if (!startedAt) return 1;
  const start = new Date(startedAt);
  if (Number.isNaN(start.getTime())) return 1;
  const elapsed = Math.max(0, now.getTime() - start.getTime());
  return Math.min(limit, Math.floor(elapsed / DAY_MS) + 1);
}

export function canAccessChapter(day: number, startedAt: string | Date | null | undefined, plan: string | null | undefined, now = new Date()) {
  return Number.isInteger(day) && day >= 1 && day <= getUnlockedDay(startedAt, plan, now);
}

export function getNextUnlockDate(startedAt: string | Date | null | undefined, unlockedDay: number) {
  if (!startedAt) return null;
  const start = new Date(startedAt);
  if (Number.isNaN(start.getTime())) return null;
  return new Date(start.getTime() + unlockedDay * DAY_MS);
}
