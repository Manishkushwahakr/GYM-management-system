'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtimeMembers(initialCount: number) {
  const [totalMembers, setTotalMembers] = useState(initialCount);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('members-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        async () => {
          const { count } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
          setTotalMembers(count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { totalMembers };
}
