import { NextResponse } from 'next/server';
import { addSubscription, removeSubscription, clearSubscriptions } from '@/lib/push-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    addSubscription(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (body) {
      removeSubscription(body);
    } else {
      clearSubscriptions();
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 400 });
  }
}
