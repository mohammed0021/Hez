'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Weight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useProfileStore } from '@/stores/profile-store';
import { useWeightStore } from '@/stores/weight-store';
import { useTranslations } from 'next-intl';
import {
  calculateBMI,
  getBMICategory,
  getIdealWeightRange,
  getHealthyWeightDifference,
  type BMICategory,
} from '@/lib/bmi';

const BMI_CATEGORY_KEYS: Record<BMICategory, string> = {
  severely_underweight: 'progress.bmi_category_severely_underweight',
  underweight: 'progress.bmi_category_underweight',
  normal: 'progress.bmi_category_normal',
  overweight: 'progress.bmi_category_overweight',
  obese_class_1: 'progress.bmi_category_obese_class_1',
  obese_class_2: 'progress.bmi_category_obese_class_2',
  obese_class_3: 'progress.bmi_category_obese_class_3',
};

export default function BMIPage() {
  const t = useTranslations();
  const profileHeightCm = useProfileStore((s) => s.heightCm);
  const profileWeightKg = useProfileStore((s) => s.weightKg);
  const birthday = useProfileStore((s) => s.birthday);
  const weightEntries = useWeightStore((s) => s.entries);

  const [manualMode, setManualMode] = useState(false);
  const [manualWeight, setManualWeight] = useState(String(profileWeightKg));
  const [manualHeight, setManualHeight] = useState(String(profileHeightCm));

  const age = useMemo(() => {
    if (!birthday) return 25;
    const birth = new Date(birthday);
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return Math.max(a, 10);
  }, [birthday]);

  const weightKg = manualMode ? parseFloat(manualWeight) || 0 : profileWeightKg;
  const heightCm = manualMode ? parseFloat(manualHeight) || 0 : profileHeightCm;

  const bmi = calculateBMI(weightKg, heightCm);
  const category = getBMICategory(bmi);
  const idealRange = getIdealWeightRange(heightCm);
  const healthyDiff = getHealthyWeightDifference(weightKg, idealRange);

  const bmiPercent = Math.min((bmi / 50) * 100, 100);

  const latestEntry = weightEntries[0];
  const prevEntry = weightEntries[1];
  const weeklyChange = latestEntry && prevEntry ? latestEntry.weightKg - prevEntry.weightKg : null;

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-foreground text-2xl font-bold">{t('progress.bmi')}</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          {t('progress.bmi_auto_from_profile')}
        </p>
      </div>

      {/* Auto-calculated from profile */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-border/50 bg-card rounded-2xl border p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
            {t('progress.your_stats')}
          </p>
          <button
            onClick={() => {
              setManualMode(!manualMode);
              if (!manualMode) {
                setManualWeight(String(profileWeightKg));
                setManualHeight(String(profileHeightCm));
              }
            }}
            className="text-primary hover:text-primary/80 text-[10px] font-medium transition-colors"
          >
            {manualMode ? t('progress.use_profile_values') : t('progress.manual_input')}
          </button>
        </div>

        {manualMode ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-muted-foreground mb-1 block text-[10px] font-medium">
                  {t('progress.weight')} (kg)
                </label>
                <input
                  type="number"
                  value={manualWeight}
                  onChange={(e) => setManualWeight(e.target.value)}
                  className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
                  inputMode="decimal"
                />
              </div>
              <div className="flex-1">
                <label className="text-muted-foreground mb-1 block text-[10px] font-medium">
                  {t('profile.height')} (cm)
                </label>
                <input
                  type="number"
                  value={manualHeight}
                  onChange={(e) => setManualHeight(e.target.value)}
                  className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-foreground text-lg font-bold">{weightKg.toFixed(1)}</p>
              <p className="text-muted-foreground/60 text-[9px] font-medium tracking-wider uppercase">
                kg
              </p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-foreground text-lg font-bold">{heightCm.toFixed(0)}</p>
              <p className="text-muted-foreground/60 text-[9px] font-medium tracking-wider uppercase">
                cm
              </p>
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-center">
              <p className="text-foreground text-lg font-bold">{age}</p>
              <p className="text-muted-foreground/60 text-[9px] font-medium tracking-wider uppercase">
                {t('progress.age')}
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* BMI Result */}
      {bmi > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="bg-primary/10 border-primary/20 mx-auto inline-flex size-32 items-center justify-center rounded-full border-4">
              <div>
                <p className="text-foreground text-4xl font-bold tracking-tight">
                  {bmi.toFixed(1)}
                </p>
                <p className={`text-[10px] font-semibold ${category.color}`}>
                  {t(BMI_CATEGORY_KEYS[category.id])}
                </p>
              </div>
            </div>
          </motion.div>

          {/* BMI Scale Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <div className="relative h-3 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500">
              <div
                className="border-primary absolute top-1/2 size-5 -translate-y-1/2 rounded-full border-2 bg-white shadow-lg transition-all"
                style={{ left: `${bmiPercent}%`, marginLeft: -10 }}
              />
            </div>
            <div className="text-muted-foreground mt-1 flex justify-between text-[8px]">
              <span>0</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>40</span>
              <span>50</span>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="border-border/50 bg-card rounded-xl border p-4 text-center">
              <Weight className="text-primary mx-auto size-4" />
              <p className="text-foreground mt-1 text-lg font-bold">{weightKg.toFixed(1)} kg</p>
              <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
                {t('progress.your_weight')}
              </p>
            </div>
            <div className="border-border/50 bg-card rounded-xl border p-4 text-center">
              <Ruler className="text-primary mx-auto size-4" />
              <p className="text-foreground mt-1 text-lg font-bold">{heightCm.toFixed(0)} cm</p>
              <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
                {t('progress.your_height')}
              </p>
            </div>
          </motion.div>

          {/* Weekly Change */}
          {weeklyChange !== null && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="border-border/50 bg-card rounded-xl border p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wider uppercase">
                  {t('progress.weekly_weight_change')}
                </p>
                <div className="flex items-center gap-1.5">
                  {weeklyChange > 0 ? (
                    <TrendingUp size={16} className="text-red-500" />
                  ) : weeklyChange < 0 ? (
                    <TrendingDown size={16} className="text-green-500" />
                  ) : (
                    <Minus size={16} className="text-muted-foreground" />
                  )}
                  <span
                    className={`text-lg font-bold ${weeklyChange > 0 ? 'text-red-500' : weeklyChange < 0 ? 'text-green-500' : 'text-foreground'}`}
                  >
                    {weeklyChange > 0 ? '+' : ''}
                    {weeklyChange.toFixed(1)} kg
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Ideal Weight Range */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={`rounded-xl border p-4 ${
              healthyDiff.direction === 'maintain'
                ? 'border-green-500/20 bg-green-500/5'
                : healthyDiff.direction === 'lose'
                  ? 'border-orange-500/20 bg-orange-500/5'
                  : 'border-blue-500/20 bg-blue-500/5'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="text-foreground text-xs font-medium">
                {t('progress.healthy_weight_range')}
              </p>
              <span
                className={`text-[10px] font-semibold ${
                  healthyDiff.direction === 'maintain' ? 'text-green-500' : 'text-muted-foreground'
                }`}
              >
                BMI 18.5–25
              </span>
            </div>
            <p className="text-foreground text-lg font-bold">
              {idealRange.minKg.toFixed(1)} kg – {idealRange.maxKg.toFixed(1)} kg
            </p>
            <p
              className={`mt-1 text-xs ${healthyDiff.direction === 'maintain' ? 'text-green-600' : healthyDiff.direction === 'lose' ? 'text-orange-600' : 'text-blue-600'}`}
            >
              {healthyDiff.direction === 'maintain'
                ? t('progress.bmi_healthy_maintain')
                : healthyDiff.direction === 'lose'
                  ? t('progress.bmi_healthy_lose', { diff: healthyDiff.diffKg.toFixed(1) })
                  : t('progress.bmi_healthy_gain', { diff: healthyDiff.diffKg.toFixed(1) })}
            </p>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-1"
          >
            {[
              {
                id: 'severely_underweight' as const,
                range: '< 16',
                color: 'bg-blue-600',
                active: category.id === 'severely_underweight',
              },
              {
                id: 'underweight' as const,
                range: '16 – 18.5',
                color: 'bg-blue-500',
                active: category.id === 'underweight',
              },
              {
                id: 'normal' as const,
                range: '18.5 – 25',
                color: 'bg-green-500',
                active: category.id === 'normal',
              },
              {
                id: 'overweight' as const,
                range: '25 – 30',
                color: 'bg-yellow-500',
                active: category.id === 'overweight',
              },
              {
                id: 'obese_class_1' as const,
                range: '30 – 35',
                color: 'bg-orange-500',
                active: category.id === 'obese_class_1',
              },
              {
                id: 'obese_class_2' as const,
                range: '35 – 40',
                color: 'bg-red-500',
                active: category.id === 'obese_class_2',
              },
              {
                id: 'obese_class_3' as const,
                range: '> 40',
                color: 'bg-red-700',
                active: category.id === 'obese_class_3',
              },
            ].map((row) => (
              <div
                key={row.id}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all ${
                  row.active ? 'bg-muted/50 border-border border' : 'opacity-40'
                }`}
              >
                <div className={`size-2.5 rounded-full ${row.color}`} />
                <span
                  className={`flex-1 text-xs ${row.active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                >
                  {t(BMI_CATEGORY_KEYS[row.id])}
                </span>
                <span className="text-muted-foreground/60 text-[10px]">{row.range}</span>
              </div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}
