'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Database,
  Shield,
  HardDrive,
  Radio,
  Bell,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

const SERVICES = [
  {
    key: 'database',
    label: 'Database',
    icon: Database,
    description: 'PostgreSQL primary database',
  },
  {
    key: 'authentication',
    label: 'Authentication',
    icon: Shield,
    description: 'Supabase Auth service',
  },
  { key: 'storage', label: 'Storage', icon: HardDrive, description: 'File and image storage' },
  { key: 'realtime', label: 'Realtime', icon: Radio, description: 'WebSocket connections' },
  {
    key: 'notificationService',
    label: 'Notifications',
    icon: Bell,
    description: 'Push notification service',
  },
] as const;

const STATUS_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  healthy: CheckCircle,
  degraded: AlertTriangle,
  unhealthy: XCircle,
  unknown: AlertTriangle,
};

const STATUS_COLORS: Record<string, string> = {
  healthy: 'text-emerald-500',
  degraded: 'text-amber-500',
  unhealthy: 'text-red-500',
  unknown: 'text-muted-foreground',
};

const STATUS_BG: Record<string, string> = {
  healthy: 'bg-emerald-500/10',
  degraded: 'bg-amber-500/10',
  unhealthy: 'bg-red-500/10',
  unknown: 'bg-muted',
};

const STATUS_LABELS: Record<string, string> = {
  healthy: 'Operational',
  degraded: 'Degraded',
  unhealthy: 'Down',
  unknown: 'Unknown',
};

type HealthState = Record<string, string>;

export default function SystemHealthPage() {
  const [health, setHealth] = useState<HealthState>({});
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/admin/api/health');
        const data = await res.json();
        if (!cancelled) {
          setHealth(data);
          setLastChecked(new Date());
        }
      } catch {
        if (!cancelled) {
          setHealth({
            database: 'unhealthy',
            authentication: 'unhealthy',
            storage: 'unhealthy',
            realtime: 'unknown',
            notificationService: 'unknown',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const statuses = Object.values(health);
  const allHealthy = statuses.length > 0 && statuses.every((s) => s === 'healthy');
  const hasDegraded = statuses.some((s) => s === 'degraded');
  const hasDown = statuses.some((s) => s === 'unhealthy');

  let overallStatus: string;
  let overallColor: string;
  if (Object.keys(health).length === 0) {
    overallStatus = 'Checking systems...';
    overallColor = 'text-muted-foreground';
  } else if (allHealthy) {
    overallStatus = 'All Systems Operational';
    overallColor = 'text-emerald-500';
  } else if (hasDown) {
    overallStatus = 'System Issues Detected';
    overallColor = 'text-red-500';
  } else if (hasDegraded) {
    overallStatus = 'Some Systems Degraded';
    overallColor = 'text-amber-500';
  } else {
    overallStatus = 'Status Unknown';
    overallColor = 'text-muted-foreground';
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">System Health</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor the status of all system services
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          disabled={loading}
          className="bg-muted text-muted-foreground hover:bg-muted/80 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Checking...' : 'Refresh'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-8 rounded-2xl border p-6 ${
          allHealthy
            ? 'border-emerald-500/20 bg-emerald-500/5'
            : hasDown
              ? 'border-red-500/20 bg-red-500/5'
              : 'border-amber-500/20 bg-amber-500/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 items-center justify-center rounded-xl ${
              allHealthy ? 'bg-emerald-500/10' : hasDown ? 'bg-red-500/10' : 'bg-amber-500/10'
            }`}
          >
            <Activity size={20} className={overallColor} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${overallColor}`}>{overallStatus}</p>
            {lastChecked && (
              <p className="text-muted-foreground text-xs">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, i) => {
          const status = health[service.key] || 'unknown';
          const StatusIcon = STATUS_ICONS[status] || AlertTriangle;
          const Icon = service.icon;

          return (
            <motion.div
              key={service.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-border/50 bg-card rounded-2xl border p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl ${STATUS_BG[status]}`}
                  >
                    <Icon size={18} className={STATUS_COLORS[status]} />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-medium">{service.label}</p>
                    <p className="text-muted-foreground text-xs">{service.description}</p>
                  </div>
                </div>
                <StatusIcon size={18} className={STATUS_COLORS[status]} />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    status === 'healthy'
                      ? 'bg-emerald-500'
                      : status === 'degraded'
                        ? 'bg-amber-500'
                        : status === 'unhealthy'
                          ? 'bg-red-500'
                          : 'bg-muted-foreground'
                  }`}
                />
                <span className={`text-xs font-medium ${STATUS_COLORS[status]}`}>
                  {STATUS_LABELS[status]}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
