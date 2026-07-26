'use client';

import { motion } from 'framer-motion';
import { Lock, AlertTriangle, ShieldAlert, Activity, FileText } from 'lucide-react';

const SECURITY_EVENTS = [
  {
    id: '1',
    type: 'failed_login',
    email: 'user@example.com',
    ip: '192.168.1.1',
    path: '/auth/login',
    timestamp: '2026-07-26T10:30:00Z',
    details: 'Invalid password (3 attempts)',
  },
  {
    id: '2',
    type: 'blocked_request',
    email: '—',
    ip: '10.0.0.1',
    path: '/api/push/send',
    timestamp: '2026-07-26T10:15:00Z',
    details: 'Rate limit exceeded',
  },
  {
    id: '3',
    type: 'suspicious_activity',
    email: 'test@test.com',
    ip: '45.33.32.156',
    path: '/auth/register',
    timestamp: '2026-07-26T09:45:00Z',
    details: 'Suspicious registration pattern detected',
  },
  {
    id: '4',
    type: 'admin_action',
    email: 'admin@hez.app',
    ip: '—',
    path: '/admin/user-management',
    timestamp: '2026-07-26T09:30:00Z',
    details: 'User account suspended',
  },
  {
    id: '5',
    type: 'failed_login',
    email: 'spam@mail.com',
    ip: '185.220.101.1',
    path: '/auth/login',
    timestamp: '2026-07-26T08:20:00Z',
    details: 'Brute force attempt blocked',
  },
];

const EVENT_COLORS: Record<string, string> = {
  failed_login: 'bg-red-500/10 text-red-500',
  blocked_request: 'bg-amber-500/10 text-amber-500',
  suspicious_activity: 'bg-orange-500/10 text-orange-500',
  admin_action: 'bg-blue-500/10 text-blue-500',
};

const EVENT_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  failed_login: Lock,
  blocked_request: ShieldAlert,
  suspicious_activity: AlertTriangle,
  admin_action: Activity,
};

export default function SecurityDashboardPage() {
  const stats = [
    {
      label: 'Failed Logins Today',
      value: '12',
      icon: Lock,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Blocked Requests',
      value: '47',
      icon: ShieldAlert,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Suspicious Activities',
      value: '3',
      icon: AlertTriangle,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Admin Actions Today',
      value: '8',
      icon: Activity,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Security Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Monitor security events, failed logins, and suspicious activity
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-border/50 bg-card rounded-2xl border p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground/70 text-[11px] font-medium tracking-wider uppercase">
                  {stat.label}
                </p>
                <div className={`flex size-8 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon size={14} className={stat.color} />
                </div>
              </div>
              <p className="text-foreground mt-2 text-2xl font-bold">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent events */}
      <div className="mt-8">
        <h3 className="text-foreground mb-4 text-sm font-semibold">Recent Security Events</h3>
        <div className="border-border/50 bg-card rounded-2xl border">
          {SECURITY_EVENTS.map((event, i) => {
            const Icon = EVENT_ICONS[event.type] || FileText;
            const color = EVENT_COLORS[event.type] || 'bg-muted text-muted-foreground';
            return (
              <div
                key={event.id}
                className={`flex items-start gap-3 p-4 ${i < SECURITY_EVENTS.length - 1 ? 'border-border/30 border-b' : ''}`}
              >
                <div className={`flex size-8 items-center justify-center rounded-lg ${color}`}>
                  <Icon size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-xs font-medium">
                      {event.type.replace('_', ' ')}
                    </span>
                    <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-medium ${color}`}>
                      {event.details}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-[11px]">
                    {event.email} &middot; {event.ip} &middot; {event.path}
                  </p>
                  <p className="text-muted-foreground/60 text-[10px]">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
