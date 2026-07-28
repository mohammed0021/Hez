'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useFoodDBStore, type FoodDBItem } from '@/stores/food-store';
import { useNutritionStore } from '@/stores/nutrition-store';

export function FoodSearch({
  mealType,
  onClose,
}: {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onClose: () => void;
}) {
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
    setSelectedFoods((prev) =>
      prev.map((f) => (f.food.id === foodId ? { ...f, servings: Math.max(0.25, servings) } : f)),
    );
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
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border py-2.5 pr-3 pl-9 text-sm focus:outline-none"
          placeholder="Search foods..."
          autoFocus
        />
      </div>

      <div className="flex scrollbar-none gap-2 overflow-x-auto pb-1">
        {['meat', 'dairy', 'grains', 'veg', 'fruit', 'nuts', 'fats', 'supplements', 'snacks'].map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setQuery(cat)}
              className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-medium transition-colors ${query === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
            >
              {cat}
            </button>
          ),
        )}
      </div>

      <div className="max-h-48 space-y-0.5 overflow-y-auto">
        {results.map((food) => {
          const selected = selectedFoods.find((f) => f.food.id === food.id);
          return (
            <button
              key={food.id}
              onClick={() => toggleFood(food)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${selected ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
            >
              <div className={`size-2.5 rounded-full ${selected ? 'bg-primary' : 'bg-muted'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-xs font-medium">{food.name}</p>
                <p className="text-muted-foreground text-[9px]">
                  {food.servingLabel} · {food.calories} kcal · P{food.protein} C{food.carbs} F
                  {food.fat}
                </p>
              </div>
              {selected && (
                <input
                  type="number"
                  value={selected.servings}
                  min={0.25}
                  step={0.25}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => updateServings(food.id, parseFloat(e.target.value) || 0.25)}
                  className="border-border/30 bg-background text-foreground w-14 rounded-lg border px-2 py-1 text-center text-[10px] focus:outline-none"
                />
              )}
            </button>
          );
        })}
        {query && results.length === 0 && (
          <p className="text-muted-foreground py-4 text-center text-[10px]">No foods found</p>
        )}
      </div>

      {selectedFoods.length > 0 && (
        <div className="border-border/30 bg-card/60 space-y-1 rounded-xl border p-3">
          <div className="text-muted-foreground flex justify-between text-[9px]">
            <span>Total:</span>
            <span>{Math.round(total.calories)} kcal</span>
          </div>
          <div className="text-muted-foreground flex justify-between text-[9px]">
            <span>P {total.protein.toFixed(1)}g</span>
            <span>C {total.carbs.toFixed(1)}g</span>
            <span>F {total.fat.toFixed(1)}g</span>
            <span>Fiber {total.fiber.toFixed(1)}g</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="bg-muted text-foreground min-h-[44px] flex-1 rounded-xl py-2.5 text-xs font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={selectedFoods.length === 0}
          className="bg-primary text-primary-foreground min-h-[44px] flex-1 rounded-xl py-2.5 text-xs font-medium disabled:opacity-40"
        >
          Add to Log
        </button>
      </div>
    </div>
  );
}
