'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToastStore } from '@/stores/toast-store';

const REPORT_TYPES = [
  { id: 'daily', label: 'Daily Report', description: 'Summary of the last 24 hours' },
  { id: 'weekly', label: 'Weekly Report', description: 'Full weekly analytics overview' },
  { id: 'monthly', label: 'Monthly Report', description: 'Comprehensive monthly statistics' },
  { id: 'yearly', label: 'Yearly Report', description: 'Annual performance review' },
];

const EXPORT_FORMATS = ['CSV', 'Excel', 'PDF'];

export default function ReportsPage() {
  const toast = useToastStore();
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);

  const handleGenerate = async (type: string) => {
    setGenerating(type);
    try {
      const res = await fetch(`/admin/api/reports?type=${type}`);
      if (!res.ok) throw new Error('Failed to generate report');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hez-report-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setGenerated((prev) => [type, ...prev].slice(0, 10));
      toast.success('Report downloaded');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Generate and download analytics reports
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {REPORT_TYPES.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="border-border/50 bg-card rounded-2xl border p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-10 items-center justify-center rounded-xl">
                  <FileText size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">{report.label}</p>
                  <p className="text-muted-foreground text-xs">{report.description}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {EXPORT_FORMATS.map((fmt) => {
                const key = `${report.id}-${fmt.toLowerCase()}`;
                return (
                  <Button
                    key={fmt}
                    variant="outline"
                    size="xs"
                    onClick={() => handleGenerate(key)}
                    disabled={generating === key}
                  >
                    {generating === key ? (
                      'Generating...'
                    ) : (
                      <>
                        <Download size={12} className="mr-1" />
                        {fmt}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>

            {generated.includes(`${report.id}-csv`) && (
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-500">
                <CheckCircle2 size={12} />
                Last generated: {new Date().toLocaleDateString()}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent reports */}
      <div className="mt-10">
        <h3 className="text-foreground mb-4 text-sm font-semibold">Recent Reports</h3>
        {generated.length > 0 ? (
          <div className="space-y-2">
            {generated.map((g) => (
              <div
                key={g}
                className="border-border/50 bg-card flex items-center gap-3 rounded-xl border px-4 py-3"
              >
                <FileText size={14} className="text-primary" />
                <span className="text-foreground text-xs">
                  {g
                    .split('-')
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ')}
                </span>
                <span className="text-muted-foreground ml-auto text-[10px]">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-border/50 bg-card flex h-32 items-center justify-center rounded-2xl border">
            <div className="text-center">
              <FileText size={24} className="text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground/60 mt-2 text-xs">No reports generated yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
