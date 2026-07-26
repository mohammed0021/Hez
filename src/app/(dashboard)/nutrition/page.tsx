'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Droplets, TrendingUp, Utensils } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useNutritionStore } from '@/stores/nutrition-store';
import { useWaterStore } from '@/stores/water-store';
import { useNutritionGoalsStore } from '@/stores/nutrition-goals-store';
import { MacroRing } from '@/components/nutrition/macro-ring';
import { MealCard } from '@/components/nutrition/meal-card';
import { FoodSearch } from '@/components/nutrition/food-search';
import Link from 'next/link';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;

export default function NutritionPage() {
  const [addingMeal, setAddingMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack' | null>(
    null,
  );
  const getLog = useNutritionStore((s) => s.getLog);
  const removeMeal = useNutritionStore((s) => s.removeMeal);
  const goals = useNutritionGoalsStore((s) => s.goals);
  const addWater = useWaterStore((s) => s.addWater);
  const getForDate = useWaterStore((s) => s.getForDate);
  const waterGoal = useWaterStore((s) => s.goalMl);

  const today = new Date().toISOString().slice(0, 10);
  const todayLog = getLog(today);
  const waterMl = getForDate(today);

  const macros = {
    calories: todayLog?.totalCalories || 0,
    protein: todayLog?.totalProtein || 0,
    carbs: todayLog?.totalCarbs || 0,
    fat: todayLog?.totalFat || 0,
    fiber: todayLog?.totalFiber || 0,
  };

  const dayMeals = todayLog?.meals || [];
  const waterPct = Math.min((waterMl / waterGoal) * 100, 100);

  const weekData = useMemo(() => {
    const data: { day: string; calories: number }[] = [];
    const d = new Date();
    d.setDate(d.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      const dateStr = d.toISOString().slice(0, 10);
      const log = getLog(dateStr);
      data.push({
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        calories: log?.totalCalories || 0,
      });
      d.setDate(d.getDate() + 1);
    }
    return data;
  }, [todayLog, getLog]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Nutrition</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {new Date().toLocaleDateString('en', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Link
          href="/nutrition/analytics"
          className="bg-muted text-foreground hover:bg-muted/80 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
        >
          <TrendingUp size={14} /> Analytics
        </Link>
      </div>

      {/* Calorie Ring + Macros */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="from-primary/10 to-primary/5 border-primary/20 mt-5 rounded-2xl border bg-gradient-to-br p-4"
      >
        <div className="flex items-center gap-6">
          <div className="relative flex size-24 shrink-0 items-center justify-center">
            <svg width={96} height={96} className="absolute -rotate-90">
              <circle
                cx={48}
                cy={48}
                r={42}
                fill="none"
                stroke="currentColor"
                strokeWidth={6}
                className="text-muted"
                opacity={0.15}
              />
              <motion.circle
                cx={48}
                cy={48}
                r={42}
                fill="none"
                stroke="currentColor"
                strokeWidth={6}
                strokeLinecap="round"
                className="stroke-primary"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 42 * (1 - Math.min(macros.calories / goals.calories, 1)),
                }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="text-center">
              <p className="text-foreground text-2xl font-bold tabular-nums">{macros.calories}</p>
              <p className="text-muted-foreground text-[9px]">of {goals.calories} kcal</p>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-2">
            <MacroRing
              value={macros.protein}
              max={goals.protein}
              label="Protein"
              color="stroke-blue-500"
            />
            <MacroRing
              value={macros.carbs}
              max={goals.carbs}
              label="Carbs"
              color="stroke-amber-500"
            />
            <MacroRing value={macros.fat} max={goals.fat} label="Fat" color="stroke-rose-500" />
            <MacroRing
              value={macros.fiber}
              max={goals.fiber}
              label="Fiber"
              color="stroke-green-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
        className="mt-4 grid grid-cols-3 gap-2"
      >
        <Link
          href="/nutrition/water"
          className="border-border/40 bg-card hover:border-primary/30 rounded-xl border p-3 text-center transition-colors"
        >
          <Droplets size={16} className="mx-auto text-blue-500" />
          <p className="text-foreground mt-1 text-sm font-bold">{waterMl}ml</p>
          <p className="text-muted-foreground text-[9px]">Water</p>
        </Link>
        <Link
          href="/nutrition/goals"
          className="border-border/40 bg-card hover:border-primary/30 rounded-xl border p-3 text-center transition-colors"
        >
          <Utensils size={16} className="text-primary mx-auto" />
          <p className="text-foreground mt-1 text-sm font-bold">
            {macros.calories ? Math.round(macros.calories) : '--'}
          </p>
          <p className="text-muted-foreground text-[9px]">Calories</p>
        </Link>
        <Link
          href="/nutrition/foods"
          className="border-border/40 bg-card hover:border-primary/30 rounded-xl border p-3 text-center transition-colors"
        >
          <Plus size={16} className="mx-auto text-green-500" />
          <p className="text-foreground mt-1 text-sm font-bold">{dayMeals.length}</p>
          <p className="text-muted-foreground text-[9px]">Meals</p>
        </Link>
      </motion.div>

      {/* Water Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.06 }}
        className="mt-3"
      >
        <div className="mb-1 flex items-center justify-between">
          <span className="text-muted-foreground text-[10px] font-medium">Hydration</span>
          <span className="text-muted-foreground text-[10px]">
            {waterMl} / {waterGoal} ml
          </span>
        </div>
        <div className="bg-muted h-2.5 overflow-hidden rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${waterPct}%` }}
            transition={{ duration: 0.6 }}
            className="h-full rounded-full bg-blue-500"
          />
        </div>
        <div className="mt-1.5 flex gap-1.5">
          {[100, 200, 300].map((ml) => (
            <button
              key={ml}
              onClick={() => addWater(today, ml)}
              className="flex-1 rounded-lg bg-blue-500/10 py-1 text-[9px] font-medium text-blue-600 transition-colors hover:bg-blue-500/20"
            >
              +{ml}ml
            </button>
          ))}
        </div>
      </motion.div>

      {/* Meals */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-sm font-semibold">Today&apos;s Meals</h2>
        </div>

        {dayMeals.map((meal) => (
          <MealCard
            key={meal.id}
            meal={meal}
            onDelete={() => removeMeal(today, meal.id)}
            onAddFood={() => setAddingMeal(meal.mealType)}
          />
        ))}

        {/* Add meal buttons */}
        <div className="grid grid-cols-2 gap-2">
          {MEAL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setAddingMeal(type)}
              className="border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary flex items-center justify-center gap-1.5 rounded-xl border border-dashed py-2.5 text-[10px] transition-colors"
            >
              <Plus size={12} /> {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Weekly Mini Chart */}
      {weekData.some((d) => d.calories > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-primary" />
            <h2 className="text-foreground text-sm font-semibold">This Week</h2>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  strokeOpacity={0.3}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="calories" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      <Link
        href="/nutrition/goals"
        className="bg-muted text-muted-foreground hover:text-foreground mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-[10px] transition-colors"
      >
        <Utensils size={12} /> Adjust nutrition goals
      </Link>

      {/* Food Search Modal */}
      <AnimatePresence>
        {addingMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center"
            onClick={() => setAddingMeal(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-background max-h-[80vh] w-full max-w-md overflow-y-auto rounded-t-2xl p-4 sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-foreground mb-3 text-sm font-semibold capitalize">
                Add {addingMeal}
              </p>
              <FoodSearch mealType={addingMeal} onClose={() => setAddingMeal(null)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-8" />
    </>
  );
}
