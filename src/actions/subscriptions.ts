'use server';

import { createClient } from '@/lib/supabase/server';
import { calculateEndDate } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function getSubscriptions(statusFilter?: string) {
  const supabase = await createClient();

  // First auto-expire past-due subscriptions
  await supabase
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('end_date', new Date().toISOString().split('T')[0]);

  let query = supabase
    .from('subscriptions')
    .select('*, users(name, phone, token_id)')
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
}

export async function assignSubscription(formData: FormData) {
  const supabase = await createClient();
  const userId = formData.get('user_id') as string;
  const plan = formData.get('plan') as string;
  const startDate =
    (formData.get('start_date') as string) ||
    new Date().toISOString().split('T')[0];

  if (!userId || !plan) {
    return { error: 'User and plan are required' };
  }

  const endDate = calculateEndDate(startDate, plan);

  // Expire any existing active subscriptions for this user
  await supabase
    .from('subscriptions')
    .update({ status: 'expired' })
    .eq('user_id', userId)
    .eq('status', 'active');

  const { error } = await supabase.from('subscriptions').insert({
    user_id: userId,
    plan,
    start_date: startDate,
    end_date: endDate,
    status: 'active',
  });

  if (error) return { error: error.message };

  revalidatePath('/subscriptions');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function getExpiringSoon() {
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];
  const threeDaysLater = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, users(name, phone, token_id)')
    .eq('status', 'active')
    .gte('end_date', today)
    .lte('end_date', threeDaysLater)
    .order('end_date', { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getMembersForDropdown() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('users')
    .select('id, name, token_id')
    .order('name');

  if (error) throw new Error(error.message);
  return data || [];
}
