'use client';

import { motion } from 'framer-motion';
import { Coffee, Beef, Apple, Utensils, Trash2, Play } from 'lucide-react';
import { useNutritionStore } from '@/stores/nutrition-store';

const mealIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  breakfast: Coffee,
  lunch: Beef,
  snack: Apple,
  dinner: Utensils,
};

const mealLabels: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
};

export default function FavoriteMealsPage() {
  const templates = useNutritionStore((s) => s.mealTemplates);
  const addMeal = useNutritionStore((s) => s.addMeal);
  const deleteTemplate = useNutritionStore((s) => s.deleteTemplate);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Favorite Meals</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{templates.length} saved meals</p>
      </div>

      {templates.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <Utensils size={48} className="text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            Save meals from your daily log to quickly add them later.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {templates.map((t, i) => {
          const Icon = mealIcons[t.mealType] || Utensils;
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-border/50 bg-card p-3">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                  <Icon size={15} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground">{mealLabels[t.mealType]} · {Math.round(t.totalCalories)} kcal</p>
                </div>
              </div>
              <div className="mt-2 text-[9px] text-muted-foreground/60 space-y-0.5">
                {t.foods.map((f, fi) => (
                  <div key={fi} className="flex justify-between">
                    <span>{f.foodName} ×{f.servings}</span>
                    <span>{Math.round(f.calories * f.servings)} kcal</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-1 text-[9px] text-muted-foreground/60">
                <span>P {t.totalProtein.toFixed(1)}g</span>
                <span>C {t.totalCarbs.toFixed(1)}g</span>
                <span>F {t.totalFat.toFixed(1)}g</span>
                <span>Fiber {t.totalFiber.toFixed(1)}g</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { addMeal(today, t.mealType, t.foods); }}
                  className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-[10px] font-medium text-primary-foreground">
                  <Play size={11} /> Log Now
                </button>
                <button onClick={() => deleteTemplate(t.id)}
                  className="flex items-center gap-1.5 rounded-xl bg-muted px-4 py-2 text-[10px] font-medium text-muted-foreground hover:text-destructive">
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="h-8" />
    </>
  );
}
