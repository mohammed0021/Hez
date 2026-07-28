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

export function MealCard({
  meal,
  onDelete,
  onAddFood,
}: {
  meal: MealEntry;
  onDelete: () => void;
  onAddFood?: () => void;
}) {
  const Icon = mealIcons[meal.mealType] || Utensils;

  return (
    <div className="border-border/50 bg-card rounded-2xl border">
      <div className="border-border/30 flex items-center gap-3 border-b px-4 py-3">
        <Icon className="text-primary size-4" />
        <span className="text-foreground flex-1 text-sm font-semibold">
          {mealLabels[meal.mealType] || meal.mealType}
        </span>
        <span className="text-foreground text-xs font-bold">
          {Math.round(meal.totalCalories)} kcal
        </span>
      </div>
      <div className="space-y-1.5 p-4">
        {meal.foods.map((food, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-foreground">{food.foodName}</span>
            <span className="text-muted-foreground">×{food.servings}</span>
            <span className="text-muted-foreground">
              {Math.round(food.calories * food.servings)} kcal
            </span>
          </div>
        ))}
        <div className="border-border/20 flex gap-2 border-t pt-1.5">
          {onAddFood && (
            <button
              onClick={onAddFood}
              className="text-primary hover:text-primary/80 flex min-h-[44px] items-center gap-1 text-[10px]"
            >
              <Plus className="size-4" /> Add Food
            </button>
          )}
          <button
            onClick={onDelete}
            className="text-muted-foreground/40 hover:text-destructive ml-auto flex min-h-[44px] items-center gap-1 text-[10px]"
          >
            <Trash2 className="size-4" /> Remove
          </button>
        </div>
      </div>
      <div className="border-border/20 text-muted-foreground/60 flex gap-3 border-t px-4 py-2 text-[9px]">
        <span>P {meal.totalProtein.toFixed(1)}g</span>
        <span>C {meal.totalCarbs.toFixed(1)}g</span>
        <span>F {meal.totalFat.toFixed(1)}g</span>
        <span>Fiber {meal.totalFiber.toFixed(1)}g</span>
      </div>
    </div>
  );
}
