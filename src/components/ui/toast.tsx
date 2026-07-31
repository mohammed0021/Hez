'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToastStore, type ToastVariant } from '@/stores/toast-store';
import { cn } from '@/lib/utils';

const iconMap: Record<ToastVariant, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-destructive/30 bg-destructive/10 text-destructive',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-info/30 bg-info/10 text-info',
};

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const Icon = iconMap[variant];
  return <Icon size={20} className="shrink-0" />;
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const topToasts = toasts.filter((t) => t.position === 'top');
  const bottomToasts = toasts.filter((t) => t.position === 'bottom');

  return (
    <>
      <div className="safe-top pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2">
        <AnimatePresence mode="popLayout">
          {topToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
      <div className="safe-bottom pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2">
        <AnimatePresence mode="popLayout">
          {bottomToasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: { id: string; message: string; description?: string; variant: ToastVariant };
  onDismiss: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={cn(
        'pointer-events-auto mx-4 flex w-full max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-xl',
        variantStyles[toast.variant],
      )}
    >
      <ToastIcon variant={toast.variant} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{toast.message}</p>
        {toast.description && <p className="mt-0.5 text-xs opacity-80">{toast.description}</p>}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
