'use client';

import { Coffee, Beef, Apple, Utensils, Trash2, Plus } from 'lucide-react';
import type { MealEntry } from '@/stores/nutrition-store';

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

export function MealCard({ meal, onDelete, onAddFood }: { meal: MealEntry; onDelete: () => void; onAddFood?: () => void }) {
  const Icon = mealIcons[meal.mealType] || Utensils;

  return (
    <div className="rounded-2xl border border-border/50 bg-card">
      <div className="flex items-center gap-3 border-b border-border/30 px-4 py-3">
        <Icon size={14} className="text-primary" />
        <span className="text-sm font-semibold text-foreground flex-1">{mealLabels[meal.mealType] || meal.mealType}</span>
        <span className="text-xs font-bold text-foreground">{Math.round(meal.totalCalories)} kcal</span>
      </div>
      <div className="p-3 space-y-1.5">
        {meal.foods.map((food, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-foreground">{food.foodName}</span>
            <span className="text-muted-foreground">×{food.servings}</span>
            <span className="text-muted-foreground">{Math.round(food.calories * food.servings)} kcal</span>
          </div>
        ))}
        <div className="flex gap-2 pt-1.5 border-t border-border/20">
          {onAddFood && (
            <button onClick={onAddFood} className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80">
              <Plus size={10} /> Add Food
            </button>
          )}
          <button onClick={onDelete} className="flex items-center gap-1 text-[10px] text-muted-foreground/40 hover:text-destructive ml-auto">
            <Trash2 size={10} /> Remove
          </button>
        </div>
      </div>
      <div className="flex gap-2 border-t border-border/20 px-3 py-2 text-[9px] text-muted-foreground/60">
        <span>P {meal.totalProtein.toFixed(1)}g</span>
        <span>C {meal.totalCarbs.toFixed(1)}g</span>
        <span>F {meal.totalFat.toFixed(1)}g</span>
        <span>Fiber {meal.totalFiber.toFixed(1)}g</span>
      </div>
    </div>
  );
}
