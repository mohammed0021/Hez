import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/onboarding';

  if (code) {
    const cookieString = request.headers.get('cookie') || '';
    const cookies = cookieString.split(';').reduce<Record<string, string>>((acc, c) => {
      const [key, ...val] = c.trim().split('=');
      if (key) acc[key] = val.join('=');
      return acc;
    }, {});

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies[name];
          },
          set(name: string, value: string) {
            cookies[name] = value;
          },
          remove(name: string) {
            delete cookies[name];
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}
