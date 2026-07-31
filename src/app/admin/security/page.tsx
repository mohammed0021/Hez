'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, AlertTriangle, Loader2 } from 'lucide-react';

type HealthStatus = Record<string, string>;

function statusColor(status: string) {
  if (status === 'healthy') return 'text-emerald-500';
  if (status === 'unhealthy') return 'text-red-500';
  return 'text-muted-foreground';
}

function statusIcon(status: string) {
  if (status === 'healthy') return Shield;
  if (status === 'unhealthy') return AlertTriangle;
  return ShieldAlert;
}

export default function SecurityDashboardPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = () => {
    setLoading(true);
    setError(null);
    fetch('/admin/api/health')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch health status');
        return res.json();
      })
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialHealth = async () => {
      try {
        const res = await fetch('/admin/api/health');
        if (!res.ok) throw new Error('Failed to fetch health status');
        const data = await res.json();
        if (!cancelled) {
          setHealth(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to fetch health status');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitialHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Security Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">System health and service status</p>
      </div>

      {loading && (
        <div className="flex h-48 items-center justify-center">
          <Loader2 size={24} className="text-muted-foreground animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex h-48 flex-col items-center justify-center gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button
            onClick={fetchHealth}
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-xs font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {health && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(health).map(([service, status], i) => {
              const Icon = statusIcon(status);
              return (
                <motion.div
                  key={service}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-border/50 bg-card rounded-2xl border p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground/70 text-[11px] font-medium tracking-wider uppercase">
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <div
                      className={`flex size-8 items-center justify-center rounded-lg ${statusColor(status)} bg-current/10`}
                    >
                      <Icon size={14} className={statusColor(status)} />
                    </div>
                  </div>
                  <p className={`mt-2 text-2xl font-bold capitalize ${statusColor(status)}`}>
                    {status}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8">
            <div className="border-border/50 bg-card rounded-2xl border p-8 text-center">
              <ShieldAlert size={32} className="text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground mt-3 text-sm">
                Security events API not yet implemented
              </p>
              <p className="text-muted-foreground/60 mt-1 text-xs">
                The health endpoint is available above. Detailed security event logging will be
                added in a future update.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
