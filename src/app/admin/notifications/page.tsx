'use client';

import { useState } from 'react';
import { Send, Users, Globe, Languages, Crown, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToastStore } from '@/stores/toast-store';

export default function AdminNotificationsPage() {
  const toast = useToastStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const handleSend = async () => {
    if (!title || !body) return;
    setSending(true);
    setSent(false);
    try {
      const res = await fetch('/admin/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setSent(true);
      setSentCount(data.sent || 0);
      setTitle('');
      setBody('');
      toast.success(`Notification sent to ${data.sent} users`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Admin Notifications</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Send announcements to users via push and in-app notifications
        </p>
      </div>

      <div className="mb-6">
        <p className="text-foreground mb-3 text-xs font-medium">Send to</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Users', icon: Users },
            { id: 'language', label: 'By Language', icon: Languages },
            { id: 'country', label: 'By Country', icon: Globe },
            { id: 'premium', label: 'Premium Users', icon: Crown },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTarget(t.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  target === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-xl space-y-4">
        <div>
          <label className="text-foreground mb-1.5 block text-xs font-medium">Title</label>
          <Input
            placeholder="Notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9"
          />
        </div>
        <div>
          <label className="text-foreground mb-1.5 block text-xs font-medium">Message</label>
          <textarea
            placeholder="Notification body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="border-border/50 bg-background text-foreground placeholder:text-muted-foreground/50 focus:ring-primary/20 w-full rounded-xl border px-3 py-2 text-xs focus:ring-2 focus:outline-none"
          />
        </div>

        {sent && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-xs text-emerald-500">
            <CheckCircle2 size={14} />
            Notification sent to {sentCount} users
          </div>
        )}

        <Button
          onClick={handleSend}
          disabled={sending || !title || !body}
          className="w-full sm:w-auto"
        >
          <Send size={14} className="mr-1.5" />
          {sending ? 'Sending...' : 'Send Notification'}
        </Button>
      </div>

      <div className="mt-10">
        <h3 className="text-foreground mb-3 text-xs font-semibold">Recent Announcements</h3>
        <div className="border-border/50 bg-card flex h-32 items-center justify-center rounded-2xl border">
          <p className="text-muted-foreground/60 text-xs">No recent announcements</p>
        </div>
      </div>
    </div>
  );
}
