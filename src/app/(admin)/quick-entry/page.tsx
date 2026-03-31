import Topbar from '@/components/layout/Topbar';
import TokenInput from '@/components/quick-entry/TokenInput';
import RecentCheckIns from '@/components/quick-entry/RecentCheckIns';
import { getRecentCheckIns } from '@/actions/attendance';

export default async function QuickEntryPage() {
  const recentCheckIns = await getRecentCheckIns(10);

  return (
    <>
      <Topbar title="Quick Entry" />
      <div className="p-8">
        {/* Background glow */}
        <div className="fixed top-1/3 left-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-2xl mx-auto pt-8">
          <TokenInput />
          <RecentCheckIns initialData={recentCheckIns as any} />
        </div>
      </div>
    </>
  );
}
