import { createClient } from '@/lib/supabase-client';

export async function syncToSupabase<T extends Record<string, unknown>>(
  table: string,
  data: T & { id: string },
  userId: string,
) {
  if (!userId) return;
  const supabase = createClient();
  const { error } = await supabase
    .from(table)
    .upsert({ ...data, user_id: userId, updated_at: new Date().toISOString() })
    .select();
  if (error) console.error(`[sync] ${table} upsert error:`, error);
}

export async function deleteFromSupabase(table: string, id: string) {
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) console.error(`[sync] ${table} delete error:`, error);
}

export async function loadFromSupabase<T>(
  table: string,
  userId: string,
  options?: { orderBy?: string; ascending?: boolean; limit?: number },
): Promise<T[]> {
  if (!userId) return [];
  const supabase = createClient();
  let query = supabase.from(table).select('*').eq('user_id', userId);
  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options?.ascending ?? false });
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  const { data, error } = await query;
  if (error) {
    console.error(`[sync] ${table} load error:`, error);
    return [];
  }
  return (data ?? []) as T[];
}
