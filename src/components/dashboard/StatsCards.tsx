'use client';

import Card from '@/components/ui/Card';
import { useRealtimeMembers } from '@/hooks/useRealtimeMembers';
import { useRealtimeAttendance } from '@/hooks/useRealtimeAttendance';
import { getCrowdLevel } from '@/lib/utils';

interface StatsCardsProps {
  initialTotalMembers: number;
  initialActiveToday: number;
  initialCrowdCount: number;
}

export default function StatsCards({
  initialTotalMembers,
  initialActiveToday,
  initialCrowdCount,
}: StatsCardsProps) {
  const { totalMembers } = useRealtimeMembers(initialTotalMembers);
  const { crowdCount, crowdLevel, crowdColor } = useRealtimeAttendance(initialCrowdCount);

  const stats = [
    {
      label: 'Total Members',
      value: totalMembers,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      color: '#3B82F6',
      gradient: 'from-blue-500/10 to-blue-600/5',
    },
    {
      label: 'Active Today',
      value: initialActiveToday,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: '#10B981',
      gradient: 'from-emerald-500/10 to-emerald-600/5',
    },
    {
      label: 'Crowd Status',
      value: crowdLevel,
      subtitle: `${crowdCount} people (last 1hr)`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      color: crowdColor,
      gradient:
        crowdLevel === 'Low'
          ? 'from-emerald-500/10 to-emerald-600/5'
          : crowdLevel === 'Medium'
          ? 'from-amber-500/10 to-amber-600/5'
          : 'from-red-500/10 to-red-600/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card key={stat.label} glow={stat.color}>
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-xl`} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-400">{stat.label}</span>
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-zinc-100">{stat.value}</div>
            {stat.subtitle && (
              <p className="text-sm text-zinc-500 mt-1">{stat.subtitle}</p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
