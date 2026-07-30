import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const param = searchParams.get('type') || 'daily-csv';
  const parts = param.split('-');
  const format = parts.pop() || 'csv';
  const type = parts.join('-');

  const [profilesRes, workoutsRes] = await Promise.all([
    supabase.from('profiles').select('id, display_name, created_at, role, goal'),
    supabase.from('workouts').select('id, user_id, created_at, duration_minutes'),
  ]);

  const profiles = profilesRes.data || [];
  const workouts = workoutsRes.data || [];

  const now = new Date();
  const dateFilter = (dateStr: string) => {
    const d = new Date(dateStr);
    if (type.startsWith('daily')) return d.toDateString() === now.toDateString();
    if (type.startsWith('weekly')) {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return d >= weekAgo;
    }
    if (type.startsWith('monthly')) {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const filteredWorkouts = workouts.filter((w) => dateFilter(w.created_at));

  const header = 'Metric,Value';
  const rows = [
    header,
    `Total Users,${profiles.length}`,
    `New Users (period),${profiles.filter((p) => dateFilter(p.created_at)).length}`,
    `Total Workouts (period),${filteredWorkouts.length}`,
    `Avg Workout Duration (min),${filteredWorkouts.length > 0 ? (filteredWorkouts.reduce((s, w) => s + (w.duration_minutes || 0), 0) / filteredWorkouts.length).toFixed(1) : 0}`,
    `Generated,${now.toISOString()}`,
  ];

  const csv = rows.join('\n');

  const mimeTypes: Record<string, string> = {
    csv: 'text/csv',
    excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    pdf: 'application/pdf',
  };

  const ext = format === 'excel' ? 'xlsx' : format;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': mimeTypes[format] || 'text/csv',
      'Content-Disposition': `attachment; filename="hez-report-${type}-${now.toISOString().slice(0, 10)}.${ext}"`,
    },
  });
}
