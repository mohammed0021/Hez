'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, ShieldOff, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton, ErrorState } from '../shared';
import type { AdminUser } from '@/types/admin';

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const limit = 20;

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (query) params.set('q', query);
      const res = await fetch(`/admin/api/users?${params}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [page, query]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (query) params.set('q', query);
        const res = await fetch(`/admin/api/users?${params}`);
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        if (!cancelled) {
          setUsers(data.users || []);
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
  }, [page, query]);

  const totalPages = Math.ceil(total / limit);

  const handleSuspend = async (id: string, suspended: boolean) => {
    try {
      await fetch('/admin/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, suspended: !suspended }),
      });
      reload();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetch(`/admin/api/users?id=${id}`, { method: 'DELETE' });
      reload();
    } catch {}
  };

  if (isLoading && users.length === 0) return <LoadingSkeleton count={5} />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1 text-sm">Search, view, and manage user accounts</p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search
            size={14}
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
          />
          <Input
            placeholder="Search by name or username..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="h-9 pl-9 text-xs"
          />
        </div>
        <span className="text-muted-foreground text-xs">{total} users</span>
      </div>

      {/* Users Table */}
      <div className="border-border/50 overflow-x-auto rounded-2xl border">
        <table className="w-full">
          <thead>
            <tr className="border-border/50 bg-muted/30 border-b">
              <th className="text-muted-foreground/70 px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase">
                User
              </th>
              <th className="text-muted-foreground/70 px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase">
                Role
              </th>
              <th className="text-muted-foreground/70 hidden px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase md:table-cell">
                Goal
              </th>
              <th className="text-muted-foreground/70 hidden px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase lg:table-cell">
                Joined
              </th>
              <th className="text-muted-foreground/70 hidden px-4 py-3 text-left text-[10px] font-semibold tracking-wider uppercase sm:table-cell">
                Verified
              </th>
              <th className="text-muted-foreground/70 px-4 py-3 text-right text-[10px] font-semibold tracking-wider uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="border-border/30 hover:bg-muted/20 border-b last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full text-xs font-bold">
                      {user.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-foreground text-sm font-medium">
                        {user.displayName || 'Unknown'}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        {user.email || user.username || '—'}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      user.role === 'admin'
                        ? 'default'
                        : user.role === 'premium'
                          ? 'secondary'
                          : 'outline'
                    }
                    className="text-[10px]"
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="text-muted-foreground hidden px-4 py-3 text-xs md:table-cell">
                  {user.goal || '—'}
                </td>
                <td className="text-muted-foreground hidden px-4 py-3 text-xs lg:table-cell">
                  {user.createdAt?.slice(0, 10) || '—'}
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <span
                    className={`text-xs ${user.isVerified ? 'text-emerald-500' : 'text-muted-foreground/50'}`}
                  >
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleSuspend(user.id, false)}
                      className="text-muted-foreground hover:bg-muted flex size-7 items-center justify-center rounded-lg hover:text-amber-500"
                      title="Suspend user"
                    >
                      <ShieldOff size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-muted-foreground hover:bg-muted flex size-7 items-center justify-center rounded-lg hover:text-red-500"
                      title="Delete user"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          Page {page} of {totalPages || 1}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="xs"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            variant="outline"
            size="xs"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
