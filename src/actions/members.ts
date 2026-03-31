'use server';

import { createClient } from '@/lib/supabase/server';
import { generateTokenId } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export async function getMembers(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (search && search.trim()) {
    query = query.or(
      `name.ilike.%${search}%,phone.ilike.%${search}%,token_id.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return data || [];
}

export async function addMember(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  if (!name?.trim() || !phone?.trim()) {
    return { error: 'Name and phone are required' };
  }

  // Generate unique token based on name initial and serial number
  const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
  let serial = (count || 0) + 1;
  const initial = name.trim().charAt(0).toUpperCase();
  
  let tokenId = `${initial}${serial.toString().padStart(2, '0')}`;
  let attempts = 0;

  // Check uniqueness (increment serial if collision exists)
  while (attempts < 10) {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('token_id', tokenId)
      .single();

    if (!existing) break;
    serial++;
    tokenId = `${initial}${serial.toString().padStart(2, '0')}`;
    attempts++;
  }

  const { data, error } = await supabase
    .from('users')
    .insert({ name: name.trim(), phone: phone.trim(), token_id: tokenId })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return { error: 'A member with this phone number already exists' };
    }
    return { error: error.message };
  }

  revalidatePath('/members');
  revalidatePath('/dashboard');
  return { data };
}

export async function updateMember(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;

  if (!name?.trim() || !phone?.trim()) {
    return { error: 'Name and phone are required' };
  }

  const { error } = await supabase
    .from('users')
    .update({ name: name.trim(), phone: phone.trim() })
    .eq('id', id);

  if (error) {
    if (error.code === '23505') {
      return { error: 'A member with this phone number already exists' };
    }
    return { error: error.message };
  }

  revalidatePath('/members');
  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteMember(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from('users').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/members');
  revalidatePath('/dashboard');
  return { success: true };
}
