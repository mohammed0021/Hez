'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useFoodDBStore, type FoodDBItem } from '@/stores/food-store';
import { useNutritionStore } from '@/stores/nutrition-store';

export function FoodSearch({ mealType, onClose }: { mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<{ food: FoodDBItem; servings: number }[]>([]);
  const searchFoods = useFoodDBStore((s) => s.searchFoods);
  const addMeal = useNutritionStore((s) => s.addMeal);

  const results = useMemo(() => searchFoods(query), [query, searchFoods]);

  const toggleFood = (food: FoodDBItem) => {
    setSelectedFoods((prev) => {
      const existing = prev.find((f) => f.food.id === food.id);
      if (existing) return prev.filter((f) => f.food.id !== food.id);
      return [...prev, { food, servings: 1 }];
    });
  };

  const updateServings = (foodId: string, servings: number) => {
    setSelectedFoods((prev) => prev.map((f) => (f.food.id === foodId ? { ...f, servings: Math.max(0.25, servings) } : f)));
  };

  const total = {
    calories: selectedFoods.reduce((s, f) => s + f.food.calories * f.servings, 0),
    protein: selectedFoods.reduce((s, f) => s + f.food.protein * f.servings, 0),
    carbs: selectedFoods.reduce((s, f) => s + f.food.carbs * f.servings, 0),
    fat: selectedFoods.reduce((s, f) => s + f.food.fat * f.servings, 0),
    fiber: selectedFoods.reduce((s, f) => s + f.food.fiber * f.servings, 0),
  };

  const handleSave = () => {
    if (selectedFoods.length === 0) return;
    const foods = selectedFoods.map((f) => ({
      foodId: f.food.id,
      foodName: f.food.name,
      servings: f.servings,
      calories: f.food.calories,
      protein: f.food.protein,
      carbs: f.food.carbs,
      fat: f.food.fat,
      fiber: f.food.fiber,
    }));
    addMeal(new Date().toISOString().slice(0, 10), mealType, foods);
    onClose();
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-border/30 bg-background pl-9 pr-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none"
          placeholder="Search foods..."
          autoFocus
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['meat', 'dairy', 'grains', 'veg', 'fruit', 'nuts', 'fats', 'supplements', 'snacks'].map((cat) => (
          <button key={cat} onClick={() => setQuery(cat)}
            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition-colors ${query === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="max-h-48 overflow-y-auto space-y-0.5">
        {results.map((food) => {
          const selected = selectedFoods.find((f) => f.food.id === food.id);
          return (
            <button key={food.id} onClick={() => toggleFood(food)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${selected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}>
              <div className={`size-2.5 rounded-full ${selected ? 'bg-primary' : 'bg-muted'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{food.name}</p>
                <p className="text-[9px] text-muted-foreground">{food.servingLabel} · {food.calories} kcal · P{food.protein} C{food.carbs} F{food.fat}</p>
              </div>
              {selected && (
                <input type="number" value={selected.servings} min={0.25} step={0.25}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateServings(food.id, parseFloat(e.target.value) || 0.25)}
                  className="w-14 rounded-lg border border-border/30 bg-background px-2 py-1 text-[10px] text-center text-foreground focus:outline-none" />
              )}
            </button>
          );
        })}
        {query && results.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4">No foods found</p>
        )}
      </div>

      {selectedFoods.length > 0 && (
        <div className="rounded-xl border border-border/30 bg-card/60 p-3 space-y-1">
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>Total:</span>
            <span>{Math.round(total.calories)} kcal</span>
          </div>
          <div className="flex justify-between text-[9px] text-muted-foreground">
            <span>P {total.protein.toFixed(1)}g</span>
            <span>C {total.carbs.toFixed(1)}g</span>
            <span>F {total.fat.toFixed(1)}g</span>
            <span>Fiber {total.fiber.toFixed(1)}g</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 rounded-xl bg-muted py-2.5 text-xs font-medium text-foreground">Cancel</button>
        <button onClick={handleSave} disabled={selectedFoods.length === 0}
          className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-medium text-primary-foreground disabled:opacity-40">
          Add to Log
        </button>
      </div>
    </div>
  );
}
