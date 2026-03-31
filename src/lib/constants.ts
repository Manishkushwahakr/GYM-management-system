import { CrowdLevel } from '@/types/database';

export const PLAN_OPTIONS = [
  { value: '1_month', label: '1 Month', days: 30 },
  { value: '3_months', label: '3 Months', days: 90 },
  { value: '6_months', label: '6 Months', days: 180 },
  { value: '12_months', label: '12 Months', days: 365 },
] as const;

export const CROWD_THRESHOLDS: { max: number; level: CrowdLevel; color: string }[] = [
  { max: 10, level: 'Low', color: '#10B981' },
  { max: 25, level: 'Medium', color: '#F59E0B' },
  { max: Infinity, level: 'High', color: '#EF4444' },
];

export const DUPLICATE_CHECK_IN_HOURS = 2;

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/quick-entry', label: 'Quick Entry', icon: 'Zap' },
  { href: '/members', label: 'Members', icon: 'Users' },
  { href: '/subscriptions', label: 'Subscriptions', icon: 'CreditCard' },
] as const;
