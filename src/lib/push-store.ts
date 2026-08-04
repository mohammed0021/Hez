import { createServerSupabaseClient } from '@/lib/supabase-server';

interface DBPushSubscription {
  endpoint: string;
  keys_p256dh: string;
  keys_auth: string;
  user_id: string;
}

function toJSON(row: DBPushSubscription): PushSubscriptionJSON {
  return {
    endpoint: row.endpoint,
    keys: {
      p256dh: row.keys_p256dh,
      auth: row.keys_auth,
    },
  };
}

export async function addSubscription(sub: PushSubscriptionJSON, userId?: string): Promise<void> {
  const supabase = await createServerSupabaseClient();
  const row = {
    user_id: userId ?? null,
    endpoint: sub.endpoint,
    keys_p256dh: sub.keys?.p256dh || '',
    keys_auth: sub.keys?.auth || '',
  };
  await supabase.from('push_subscriptions').upsert(row, { onConflict: 'endpoint' });
}

export async function removeSubscription(sub: PushSubscriptionJSON): Promise<void> {
  if (!sub.endpoint) return;
  const supabase = await createServerSupabaseClient();
  await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
}

export async function clearSubscriptions(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.from('push_subscriptions').delete().gte('created_at', '2000-01-01');
}

export async function getAllSubscriptions(): Promise<PushSubscriptionJSON[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('push_subscriptions')
    .select('endpoint, keys_p256dh, keys_auth');
  if (!data) return [];
  return (data as DBPushSubscription[]).map(toJSON);
}
