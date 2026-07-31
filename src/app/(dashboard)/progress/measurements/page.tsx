'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import {
  useMeasurementStore,
  MEASUREMENT_FIELDS,
  type MeasurementEntry,
} from '@/stores/measurement-store';
import { useTranslations } from 'next-intl';

export default function MeasurementsPage() {
  const t = useTranslations();
  const { entries, addEntry, deleteEntry } = useMeasurementStore();

  const measurementLabel = (key: string) =>
    ({
      chest: t('progress.measurement_chest'),
      waist: t('progress.measurement_waist'),
      hips: t('progress.measurement_hips'),
      leftArm: t('progress.measurement_left_arm'),
      rightArm: t('progress.measurement_right_arm'),
      leftThigh: t('progress.measurement_left_thigh'),
      rightThigh: t('progress.measurement_right_thigh'),
      leftCalf: t('progress.measurement_left_calf'),
      rightCalf: t('progress.measurement_right_calf'),
      shoulders: t('progress.measurement_shoulders'),
      neck: t('progress.measurement_neck'),
    })[key] ?? key;
  const [showForm, setShowForm] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formNotes, setFormNotes] = useState('');

  const sorted = useMemo(
    () => [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [entries],
  );

  const handleAdd = () => {
    const entry: Omit<MeasurementEntry, 'id'> = {
      date: new Date().toISOString().slice(0, 10),
      notes: formNotes,
      chest: null,
      waist: null,
      hips: null,
      leftArm: null,
      rightArm: null,
      leftThigh: null,
      rightThigh: null,
      leftCalf: null,
      rightCalf: null,
      shoulders: null,
      neck: null,
    };
    for (const field of MEASUREMENT_FIELDS) {
      (entry as Record<string, string | number | null>)[field.key] = formValues[field.key]
        ? parseFloat(formValues[field.key]!)
        : null;
    }
    addEntry(entry);
    setFormValues({});
    setFormNotes('');
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">{t('progress.body_measurements')}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {t('progress.entries_count', { count: entries.length })}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
        >
          <Plus className="size-4" /> {t('progress.log')}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/50 bg-card mt-4 space-y-3 rounded-2xl border p-4"
        >
          <div className="grid grid-cols-2 gap-3">
            {MEASUREMENT_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="text-muted-foreground/60 mb-0.5 block text-[10px] font-medium tracking-wider uppercase">
                  {measurementLabel(f.key)} (cm)
                </label>
                <input
                  type="number"
                  value={formValues[f.key] || ''}
                  onChange={(e) => setFormValues({ ...formValues, [f.key]: e.target.value })}
                  className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-lg border px-2.5 py-2 text-xs focus:outline-none"
                  placeholder="--"
                  inputMode="decimal"
                />
              </div>
            ))}
          </div>
          <input
            type="text"
            value={formNotes}
            onChange={(e) => setFormNotes(e.target.value)}
            className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
            placeholder={t('progress.notes_optional')}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="bg-muted text-foreground min-h-[44px] flex-1 rounded-xl py-2 text-xs font-medium"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleAdd}
              className="bg-primary text-primary-foreground min-h-[44px] flex-1 rounded-xl py-2 text-xs font-medium"
            >
              {t('common.save')}
            </button>
          </div>
        </motion.div>
      )}

      {entries.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground text-sm">{t('progress.no_measurements')}</p>
        </div>
      )}

      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="mt-5 space-y-4"
        >
          {MEASUREMENT_FIELDS.filter((f) => sorted.some((e) => e[f.key] != null)).map((field) => {
            const data = sorted
              .filter((e) => e[field.key] != null)
              .map((e) => ({ date: e.date.slice(5), value: e[field.key] as number }));
            const latest = data[data.length - 1];
            const prev = data[data.length - 2];
            const change = latest && prev ? latest.value - prev.value : 0;
            const trend = change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable';
            return (
              <div key={field.key} className="border-border/50 bg-card rounded-2xl border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-foreground text-sm font-medium">
                    {measurementLabel(field.key)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-bold">
                      {latest?.value ?? '--'} cm
                    </span>
                    {change !== 0 && (
                      <span
                        className={`flex items-center gap-0.5 text-[10px] ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}
                      >
                        {trend === 'up' ? (
                          <TrendingUp className="size-4" />
                        ) : trend === 'down' ? (
                          <TrendingDown className="size-4" />
                        ) : (
                          <Minus className="size-4" />
                        )}
                        {Math.abs(change).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                {data.length > 1 && (
                  <div className="h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(var(--primary))"
                          strokeWidth={1.5}
                          dot={{ r: 2 }}
                        />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 8 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis
                          domain={['dataMin - 1', 'dataMax + 1']}
                          tick={{ fontSize: 8 }}
                          axisLine={false}
                          tickLine={false}
                          width={30}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 6,
                            fontSize: 10,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <div className="text-muted-foreground mt-1 flex gap-1 text-[8px]">
                  <span>
                    {t('progress.latest', {
                      date: latest ? new Date(latest.date).toLocaleDateString() : '--',
                    })}
                  </span>
                  <span>· {t('progress.entries_count', { count: data.length })}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* History */}
      <div className="mt-6 space-y-1">
        <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
          {t('progress.measurement_history')}
        </p>
        {entries.map((e, i) => {
          const filled = MEASUREMENT_FIELDS.filter((f) => e[f.key] != null).length;
          return (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="hover:bg-muted/50 group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
            >
              <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <span className="text-foreground text-xs font-bold">{filled}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-xs">{new Date(e.date).toLocaleDateString()}</p>
                <p className="text-muted-foreground text-[10px]">
                  {t('progress.measurements_logged', { count: filled })}
                </p>
              </div>
              <button
                onClick={() => deleteEntry(e.id)}
                className="text-muted-foreground/40 hover:text-destructive opacity-0 transition-all group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="h-8" />
    </>
  );
}
