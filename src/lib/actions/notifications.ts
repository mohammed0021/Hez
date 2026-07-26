'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getNotifications(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);
  if (error) throw error;
}

export async function createNotification(notification: {
  user_id: string;
  title: string;
  body?: string;
  type: string;
  data?: Record<string, unknown>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('notifications')
    .insert(notification)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function sendBulkNotification(notification: {
  title: string;
  body?: string;
  type: string;
  userFilter?: Record<string, unknown>;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: allUsers } = await supabase.from('profiles').select('id');
  if (!allUsers) return { sent: 0 };
  const notifications = allUsers.map((u) => ({
    user_id: u.id,
    title: notification.title,
    body: notification.body,
    type: notification.type,
    data: {},
  }));
  const { error } = await supabase.from('notifications').insert(notifications);
  if (error) throw error;
  return { sent: notifications.length };
}
