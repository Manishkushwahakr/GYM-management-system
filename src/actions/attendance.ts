'use server';

import { createClient } from '@/lib/supabase/server';
import { DUPLICATE_CHECK_IN_HOURS } from '@/lib/constants';
import { CheckInResult } from '@/types/database';
import { revalidatePath } from 'next/cache';

export async function checkIn(tokenId: string): Promise<CheckInResult> {
  const supabase = await createClient();
  const token = tokenId.trim().toUpperCase();

  if (!token) {
    return { success: false, message: 'Please enter a token ID' };
  }

  // 1. Find user by token
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, token_id')
    .eq('token_id', token)
    .single();

  if (userError || !user) {
    return { success: false, message: 'Token not found. Please check and try again.' };
  }

  // 2. Check for duplicate check-in within 2 hours
  const cutoffTime = new Date(
    Date.now() - DUPLICATE_CHECK_IN_HOURS * 60 * 60 * 1000
  ).toISOString();

  const { data: recent } = await supabase
    .from('attendance')
    .select('check_in_time')
    .eq('user_id', user.id)
    .gte('check_in_time', cutoffTime)
    .order('check_in_time', { ascending: false })
    .limit(1)
    .single();

  if (recent) {
    const checkedInAt = new Date(recent.check_in_time).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return {
      success: false,
      message: `${user.name} already checked in at ${checkedInAt}`,
      userName: user.name,
      alreadyCheckedIn: true,
    };
  }

  // 3. Check subscription status (warn but allow check-in)
  const today = new Date().toISOString().split('T')[0];
  const { data: activeSub } = await supabase
    .from('subscriptions')
    .select('end_date')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .gte('end_date', today)
    .limit(1)
    .single();

  const subscriptionExpired = !activeSub;

  // 4. Insert attendance
  const { error: attendanceError } = await supabase.from('attendance').insert({
    user_id: user.id,
    token_id: user.token_id,
  });

  if (attendanceError) {
    return { success: false, message: 'Failed to record check-in. Please try again.' };
  }

  revalidatePath('/dashboard');

  return {
    success: true,
    message: subscriptionExpired
      ? `${user.name} checked in! ⚠️ Subscription expired`
      : `${user.name} checked in successfully!`,
    userName: user.name,
    checkInTime: new Date().toISOString(),
    subscriptionExpired,
  };
}

export async function getRecentCheckIns(limit: number = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('attendance')
    .select('*, users(name, token_id)')
    .order('check_in_time', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getDashboardStats() {
  const supabase = await createClient();

  // Total members
  const { count: totalMembers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // Active today (unique users who checked in today)
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: todayAttendance } = await supabase
    .from('attendance')
    .select('user_id')
    .gte('check_in_time', todayStart.toISOString());

  const uniqueToday = new Set(todayAttendance?.map((a) => a.user_id)).size;

  // Crowd count (last 1 hour)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { data: crowdData } = await supabase
    .from('attendance')
    .select('user_id')
    .gte('check_in_time', oneHourAgo);

  const crowdCount = new Set(crowdData?.map((a) => a.user_id)).size;

  return {
    totalMembers: totalMembers || 0,
    activeToday: uniqueToday,
    crowdCount,
  };
}
