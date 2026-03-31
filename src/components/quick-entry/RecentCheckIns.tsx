'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatTime } from '@/lib/utils';
import Card from '@/components/ui/Card';

interface RecentCheckIn {
  id: string;
  check_in_time: string;
  users: { name: string; token_id: string } | null;
}

export default function RecentCheckIns({
  initialData,
}: {
  initialData: RecentCheckIn[];
}) {
  const [checkIns, setCheckIns] = useState<RecentCheckIn[]>(initialData);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('recent-checkins')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'attendance' },
        async () => {
          const { data } = await supabase
            .from('attendance')
            .select('id, check_in_time, users(name, token_id)')
            .order('check_in_time', { ascending: false })
            .limit(10);

          if (data) setCheckIns(data as unknown as RecentCheckIn[]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="mt-8">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">
        Recent Check-Ins
      </h3>

      {checkIns.length === 0 ? (
        <p className="text-zinc-500 text-center py-6">
          No check-ins yet today
        </p>
      ) : (
        <div className="space-y-2">
          {checkIns.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                index === 0
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : 'bg-zinc-800/30 hover:bg-zinc-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-zinc-700/50 text-zinc-400'
                  }`}
                >
                  {item.users?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {item.users?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {item.users?.token_id}
                  </p>
                </div>
              </div>
              <span className="text-sm text-zinc-400">
                {formatTime(item.check_in_time)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
