import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const results: Record<string, string> = {};

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({
      database: 'unknown',
      authentication: 'unhealthy',
      storage: 'unknown',
      realtime: 'unknown',
      notificationService: 'unknown',
    });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { data } = await supabase.from('profiles').select('id').limit(1);
    results.database = data ? 'healthy' : 'degraded';
  } catch {
    results.database = 'unhealthy';
  }

  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    results.authentication = authUser ? 'healthy' : 'degraded';
  } catch {
    results.authentication = 'unhealthy';
  }

  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    results.storage = Array.isArray(buckets) ? 'healthy' : 'degraded';
  } catch {
    results.storage = 'unhealthy';
  }

  results.realtime = 'unknown';
  results.notificationService = 'unknown';

  return NextResponse.json(results);
}
