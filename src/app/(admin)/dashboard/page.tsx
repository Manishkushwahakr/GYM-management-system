import Topbar from '@/components/layout/Topbar';
import StatsCards from '@/components/dashboard/StatsCards';
import ExpiringSoon from '@/components/dashboard/ExpiringSoon';
import { getDashboardStats } from '@/actions/attendance';
import { getExpiringSoon } from '@/actions/subscriptions';

export default async function DashboardPage() {
  const [stats, expiring] = await Promise.all([
    getDashboardStats(),
    getExpiringSoon(),
  ]);

  return (
    <>
      <Topbar title="Dashboard" />
      <div className="p-8 space-y-8">
        {/* Background glow */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/3 rounded-full blur-[150px] pointer-events-none" />

        <StatsCards
          initialTotalMembers={stats.totalMembers}
          initialActiveToday={stats.activeToday}
          initialCrowdCount={stats.crowdCount}
        />

        <ExpiringSoon subscriptions={expiring as any} />
      </div>
    </>
  );
}
