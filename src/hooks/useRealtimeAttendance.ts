'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCrowdLevel } from '@/lib/utils';
import { CrowdLevel } from '@/types/database';

export function useRealtimeAttendance(initialCrowdCount: number) {
  const [crowdCount, setCrowdCount] = useState(initialCrowdCount);
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>(
    getCrowdLevel(initialCrowdCount).level
  );
  const [crowdColor, setCrowdColor] = useState(
    getCrowdLevel(initialCrowdCount).color
  );

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('attendance-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'attendance' },
        async () => {
          // Recalculate crowd count
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
          const { data } = await supabase
            .from('attendance')
            .select('user_id')
            .gte('check_in_time', oneHourAgo);

          const count = new Set(data?.map((a) => a.user_id)).size;
          const { level, color } = getCrowdLevel(count);

          setCrowdCount(count);
          setCrowdLevel(level);
          setCrowdColor(color);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { crowdCount, crowdLevel, crowdColor };
}
