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
        <h1 className="text-foreground text-2xl font-bold">Favorite Meals</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">{templates.length} saved meals</p>
      </div>

      {templates.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <Utensils size={48} className="text-muted-foreground/20" />
          <p className="text-muted-foreground max-w-xs text-center text-sm">
            Save meals from your daily log to quickly add them later.
          </p>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {templates.map((t, i) => {
          const Icon = mealIcons[t.mealType] || Utensils;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-border/50 bg-card rounded-2xl border p-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex size-9 items-center justify-center rounded-xl">
                  <Icon className="text-primary size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-semibold">{t.name}</p>
                  <p className="text-muted-foreground text-[10px]">
                    {mealLabels[t.mealType]} · {Math.round(t.totalCalories)} kcal
                  </p>
                </div>
              </div>
              <div className="text-muted-foreground/60 mt-2 space-y-0.5 text-[9px]">
                {t.foods.map((f, fi) => (
                  <div key={fi} className="flex justify-between">
                    <span>
                      {f.foodName} ×{f.servings}
                    </span>
                    <span>{Math.round(f.calories * f.servings)} kcal</span>
                  </div>
                ))}
              </div>
              <div className="text-muted-foreground/60 mt-2 flex gap-1 text-[9px]">
                <span>P {t.totalProtein.toFixed(1)}g</span>
                <span>C {t.totalCarbs.toFixed(1)}g</span>
                <span>F {t.totalFat.toFixed(1)}g</span>
                <span>Fiber {t.totalFiber.toFixed(1)}g</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    addMeal(today, t.mealType, t.foods);
                  }}
                  className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-medium"
                >
                  <Play className="size-4" /> Log Now
                </button>
                <button
                  onClick={() => deleteTemplate(t.id)}
                  className="bg-muted text-muted-foreground hover:text-destructive flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-medium"
                >
                  <Trash2 className="size-4" /> Delete
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
