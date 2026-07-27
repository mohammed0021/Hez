'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Bug, Lightbulb, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton, ErrorState } from '../shared';
import type { FeedbackItem } from '@/types/admin';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-500',
  in_progress: 'bg-amber-500/10 text-amber-500',
  completed: 'bg-emerald-500/10 text-emerald-500',
  closed: 'bg-muted text-muted-foreground',
};
const TYPE_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  bug: Bug,
  feature: Lightbulb,
  contact: MessageSquare,
  rating: Star,
};

export default function FeedbackCenterPage() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (statusFilter) params.set('status', statusFilter);
        const res = await fetch(`/admin/api/feedback?${params}`);
        if (!res.ok) throw new Error('Failed to fetch feedback');
        const data = await res.json();
        if (!cancelled) {
          setFeedback(data.feedback || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, statusFilter]);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/admin/api/feedback?${params}`);
      if (!res.ok) throw new Error('Failed to fetch feedback');
      const data = await res.json();
      setFeedback(data.feedback || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch('/admin/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      reload();
    } catch {}
  };

  if (isLoading && feedback.length === 0) return <LoadingSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Feedback Center</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Review and manage user feedback, bug reports, and feature requests
        </p>
      </div>

      {/* Status filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {['', 'new', 'in_progress', 'completed', 'closed'].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Feedback list */}
      {feedback.length === 0 ? (
        <div className="border-border/50 bg-card flex h-48 flex-col items-center justify-center rounded-2xl border">
          <MessageSquare size={24} className="text-muted-foreground/40" />
          <p className="text-muted-foreground mt-2 text-sm">No feedback yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((item) => {
            const TypeIcon = TYPE_ICONS[item.type] || MessageSquare;
            return (
              <div
                key={item.id}
                className="border-border/50 bg-card hover:border-border rounded-2xl border p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      <TypeIcon size={16} className="text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-foreground truncate text-sm font-medium">{item.title}</p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${STATUS_COLORS[item.status] || ''}`}
                        >
                          {item.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                        {item.description}
                      </p>
                      <p className="text-muted-foreground/60 mt-2 text-[10px]">
                        {item.userEmail} &middot; {item.createdAt?.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="border-border/50 bg-muted text-foreground rounded-lg border px-2 py-1 text-[10px]"
                  >
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          Page {page} of {Math.ceil(total / limit) || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="xs"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="outline"
            size="xs"
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
