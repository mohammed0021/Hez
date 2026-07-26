'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler, Weight } from 'lucide-react';

function calculateBMI(weightKg: number, heightCm: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  const h = heightCm / 100;
  return weightKg / (h * h);
}

function getCategory(bmi: number): { label: string; color: string; range: string } {
  if (bmi < 16) return { label: 'Severely Underweight', color: 'text-blue-600', range: '< 16' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500', range: '16 - 18.5' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-500', range: '18.5 - 25' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-500', range: '25 - 30' };
  if (bmi < 35) return { label: 'Obese Class I', color: 'text-orange-500', range: '30 - 35' };
  if (bmi < 40) return { label: 'Obese Class II', color: 'text-red-500', range: '35 - 40' };
  return { label: 'Obese Class III', color: 'text-red-700', range: '> 40' };
}

export default function BMIPage() {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const weightKg = unit === 'metric' ? parseFloat(weight) : parseFloat(weight) * 0.453592;
  const heightCm = unit === 'metric' ? parseFloat(height) : parseFloat(height) * 2.54;

  const bmi = calculateBMI(weightKg, heightCm);
  const category = getCategory(bmi);

  const bmiPercent = Math.min((bmi / 50) * 100, 100);

  const idealMin = 18.5 * ((heightCm / 100) ** 2);
  const idealMax = 25 * ((heightCm / 100) ** 2);

  return (
    <>
      <h1 className="text-2xl font-bold text-foreground">BMI Calculator</h1>
      <p className="mt-0.5 text-sm text-muted-foreground">Body Mass Index</p>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl border border-border/50 bg-card p-4 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-medium text-muted-foreground mb-1">
              {unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
            </label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" inputMode="decimal" />
          </div>
          <div className="flex-1">
            <label className="block text-[10px] font-medium text-muted-foreground mb-1">
              {unit === 'metric' ? 'Height (cm)' : 'Height (in)'}
            </label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-xl border border-border/30 bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" inputMode="decimal" />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setUnit('metric')} className={`flex-1 rounded-xl py-2 text-xs font-medium ${unit === 'metric' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
            Metric
          </button>
          <button onClick={() => setUnit('imperial')} className={`flex-1 rounded-xl py-2 text-xs font-medium ${unit === 'imperial' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
            Imperial
          </button>
        </div>
      </motion.div>

      {bmi > 0 && (
        <>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="mt-6 text-center">
            <div className="inline-flex items-center justify-center size-28 rounded-full bg-primary/10 border-4 border-primary/20">
              <div>
                <p className="text-4xl font-bold text-foreground">{bmi.toFixed(1)}</p>
                <p className={`text-[10px] font-semibold ${category.color}`}>{category.label}</p>
              </div>
            </div>
          </motion.div>

          {/* BMI Scale Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mt-6">
            <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 relative overflow-hidden">
              <div className="absolute top-1/2 -translate-y-1/2 size-5 rounded-full bg-white border-2 border-primary shadow-lg transition-all" style={{ left: `${bmiPercent}%`, marginLeft: -10 }} />
            </div>
            <div className="flex justify-between mt-1 text-[8px] text-muted-foreground">
              <span>0</span><span>18.5</span><span>25</span><span>30</span><span>40</span><span>50</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
              <Weight size={16} className="mx-auto text-primary" />
              <p className="mt-1 text-lg font-bold text-foreground">{weightKg.toFixed(1)} kg</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Your Weight</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card p-3 text-center">
              <Ruler size={16} className="mx-auto text-primary" />
              <p className="mt-1 text-lg font-bold text-foreground">{heightCm.toFixed(0)} cm</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Your Height</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-3 rounded-xl border border-green-500/20 bg-green-500/5 p-3">
            <p className="text-xs font-medium text-green-600">Healthy Weight Range</p>
            <p className="text-sm text-foreground mt-0.5">{idealMin.toFixed(1)} kg – {idealMax.toFixed(1)} kg</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Based on BMI 18.5–25 for your height</p>
          </motion.div>
        </>
      )}

      <div className="h-8" />
    </>
  );
}
