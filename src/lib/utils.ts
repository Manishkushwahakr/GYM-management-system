import { CROWD_THRESHOLDS, PLAN_OPTIONS } from './constants';
import { CrowdLevel } from '@/types/database';

/** Generate a random 6-character fallback token (if needed) */
export function generateTokenId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I/O/0/1 to avoid confusion
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/** Get crowd level based on attendance count */
export function getCrowdLevel(count: number): { level: CrowdLevel; color: string } {
  for (const threshold of CROWD_THRESHOLDS) {
    if (count <= threshold.max) {
      return { level: threshold.level, color: threshold.color };
    }
  }
  return { level: 'High', color: '#EF4444' };
}

/** Format date to readable string */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format time to readable string */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/** Calculate end date from plan */
export function calculateEndDate(startDate: string, plan: string): string {
  const planOption = PLAN_OPTIONS.find((p) => p.value === plan);
  if (!planOption) throw new Error(`Invalid plan: ${plan}`);
  const start = new Date(startDate);
  start.setDate(start.getDate() + planOption.days);
  return start.toISOString().split('T')[0];
}

/** Get days remaining from end date */
export function getDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** Check if subscription is expired */
export function isExpired(endDate: string): boolean {
  return getDaysRemaining(endDate) < 0;
}
