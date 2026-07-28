'use client';

import { useState, useMemo, useRef, memo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Plus, Search, Trash2, Utensils } from 'lucide-react';
import { useFoodDBStore } from '@/stores/food-store';

const CATEGORIES = [
  'meat',
  'dairy',
  'grains',
  'veg',
  'fruit',
  'nuts',
  'fats',
  'supplements',
  'snacks',
];

const ROW_HEIGHT = 48;

interface FoodItemProps {
  name: string;
  servingLabel: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  category: string;
  isCustom: boolean;
  onDelete: () => void;
}

const FoodItem = memo(function FoodItem({
  name,
  servingLabel,
  calories,
  protein,
  carbs,
  fat,
  fiber,
  category,
  isCustom,
  onDelete,
}: FoodItemProps) {
  return (
    <div className="hover:bg-muted/50 group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors">
      <Utensils className="text-muted-foreground size-4 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-foreground truncate text-xs font-medium">{name}</p>
        <p className="text-muted-foreground text-[9px]">
          {servingLabel} · {calories} kcal · P{protein} C{carbs} F{fat} · Fiber {fiber}g
        </p>
      </div>
      <span className="text-muted-foreground/40 text-[8px]">{category}</span>
      {isCustom && (
        <button
          onClick={onDelete}
          className="text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
});

export default function FoodsPage() {
  const getAllFoods = useFoodDBStore((s) => s.getAllFoods);
  const addCustomFood = useFoodDBStore((s) => s.addCustomFood);
  const deleteCustomFood = useFoodDBStore((s) => s.deleteCustomFood);
  const foods = useFoodDBStore((s) => s.customFoods);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    servingSize: 100,
    servingLabel: '100g',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    category: 'meat',
  });
  const parentRef = useRef<HTMLDivElement>(null);
  const [listKey, setListKey] = useState(0);

  const filtered = useMemo(() => {
    let all = getAllFoods();
    if (query) {
      const q = query.toLowerCase();
      all = all.filter((f) => f.name.toLowerCase().includes(q));
    }
    if (category) all = all.filter((f) => f.category === category);
    return all;
  }, [query, category, getAllFoods, foods]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const handleAdd = () => {
    if (!form.name) return;
    addCustomFood(form);
    setForm({
      name: '',
      servingSize: 100,
      servingLabel: '100g',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      category: 'meat',
    });
    setShowForm(false);
    setListKey((k) => k + 1);
  };

  return (
    <div key={listKey}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Food Database</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{getAllFoods().length} foods</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
        >
          <Plus className="size-4" /> Add Food
        </button>
      </div>

      {showForm && (
        <div className="border-border/50 bg-card mt-4 space-y-2 rounded-2xl border p-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none"
            placeholder="Food name"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={form.servingSize}
              onChange={(e) => setForm({ ...form, servingSize: parseFloat(e.target.value) || 0 })}
              className="border-border/30 bg-background text-foreground focus:border-primary/40 rounded-xl border px-3 py-2 text-xs focus:outline-none"
              placeholder="Serving size (g)"
            />
            <input
              type="text"
              value={form.servingLabel}
              onChange={(e) => setForm({ ...form, servingLabel: e.target.value })}
              className="border-border/30 bg-background text-foreground focus:border-primary/40 rounded-xl border px-3 py-2 text-xs focus:outline-none"
              placeholder="e.g. 100g"
            />
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {['calories', 'protein', 'carbs', 'fat', 'fiber'].map((k) => (
              <input
                key={k}
                type="number"
                value={form[k as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [k]: parseFloat(e.target.value) || 0 })}
                className="border-border/30 bg-background text-foreground focus:border-primary/40 rounded-lg border px-1.5 py-1.5 text-center text-[10px] focus:outline-none"
                placeholder={k}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="border-border/30 bg-background text-foreground flex-1 rounded-xl border px-3 py-2 text-xs"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowForm(false)}
              className="bg-muted text-foreground min-h-[44px] rounded-xl px-4 py-2 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="bg-primary text-primary-foreground min-h-[44px] rounded-xl px-4 py-2 text-xs font-medium"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="relative mt-4">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-border/30 bg-card text-foreground focus:border-primary/40 w-full rounded-xl border py-2.5 pr-3 pl-9 text-sm focus:outline-none"
          placeholder="Search foods..."
        />
      </div>

      <div className="mt-3 flex scrollbar-none gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setCategory('')}
          className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-medium ${!category ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c === category ? '' : c)}
            className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-medium ${category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <div ref={parentRef} style={{ maxHeight: '600px', overflow: 'auto' }}>
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const food = filtered[virtualItem.index];
              if (!food) return null;
              const isCustom = !!foods.find((f) => f.id === food.id);
              return (
                <div
                  key={food.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <FoodItem
                    name={food.name}
                    servingLabel={food.servingLabel}
                    calories={food.calories}
                    protein={food.protein}
                    carbs={food.carbs}
                    fat={food.fat}
                    fiber={food.fiber}
                    category={food.category}
                    isCustom={isCustom}
                    onDelete={() => deleteCustomFood(food.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {filtered.length === 0 && (
          <p className="text-muted-foreground py-6 text-center text-[10px]">No foods found</p>
        )}
      </div>

      <div className="h-8" />
    </div>
  );
}
