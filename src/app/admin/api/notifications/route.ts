import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
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

  const { title, body, target } = await request.json();
  if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

  let query = supabase.from('profiles').select('id');
  if (target === 'premium') {
    query = query.in('role', ['premium', 'admin']);
  }
  const { data: users } = await query;
  if (!users || users.length === 0) return NextResponse.json({ sent: 0 });

  const notifications = users.map((u) => ({
    user_id: u.id,
    title,
    body: body || '',
    type: 'system' as const,
    data: {},
  }));
  const { error } = await supabase.from('notifications').insert(notifications);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ sent: notifications.length });
}
