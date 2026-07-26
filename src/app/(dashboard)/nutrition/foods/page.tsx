'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Utensils } from 'lucide-react';
import { useFoodDBStore } from '@/stores/food-store';

const CATEGORIES = ['meat', 'dairy', 'grains', 'veg', 'fruit', 'nuts', 'fats', 'supplements', 'snacks'];

export default function FoodsPage() {
  const getAllFoods = useFoodDBStore((s) => s.getAllFoods);
  const addCustomFood = useFoodDBStore((s) => s.addCustomFood);
  const deleteCustomFood = useFoodDBStore((s) => s.deleteCustomFood);
  const foods = useFoodDBStore((s) => s.customFoods);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', servingSize: 100, servingLabel: '100g', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, category: 'meat' });

  const filtered = useMemo(() => {
    let all = getAllFoods();
    if (query) {
      const q = query.toLowerCase();
      all = all.filter((f) => f.name.toLowerCase().includes(q));
    }
    if (category) all = all.filter((f) => f.category === category);
    return all;
  }, [query, category, getAllFoods, foods]);

  const handleAdd = () => {
    if (!form.name) return;
    addCustomFood(form);
    setForm({ name: '', servingSize: 100, servingLabel: '100g', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, category: 'meat' });
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Food Database</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{getAllFoods().length} foods</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
          <Plus size={14} /> Add Food
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl border border-border/50 bg-card p-4 space-y-2">
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-border/30 bg-background px-3 py-2 text-sm text-foreground focus:border-primary/40 focus:outline-none" placeholder="Food name" />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={form.servingSize} onChange={(e) => setForm({ ...form, servingSize: parseFloat(e.target.value) || 0 })}
              className="rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground focus:border-primary/40 focus:outline-none" placeholder="Serving size (g)" />
            <input type="text" value={form.servingLabel} onChange={(e) => setForm({ ...form, servingLabel: e.target.value })}
              className="rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground focus:border-primary/40 focus:outline-none" placeholder="e.g. 100g" />
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {['calories', 'protein', 'carbs', 'fat', 'fiber'].map((k) => (
              <input key={k} type="number" value={(form as any)[k]} onChange={(e) => setForm({ ...form, [k]: parseFloat(e.target.value) || 0 })}
                className="rounded-lg border border-border/30 bg-background px-1.5 py-1.5 text-[10px] text-center text-foreground focus:border-primary/40 focus:outline-none" placeholder={k} />
            ))}
          </div>
          <div className="flex gap-2">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="flex-1 rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => setShowForm(false)} className="rounded-xl bg-muted px-4 py-2 text-xs font-medium text-foreground">Cancel</button>
            <button onClick={handleAdd} className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Save</button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="mt-4 relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-border/30 bg-card pl-9 pr-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" placeholder="Search foods..." />
      </div>

      {/* Category chips */}
      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button onClick={() => setCategory('')} className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-medium ${!category ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCategory(c === category ? '' : c)}
            className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-medium ${category === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{c}</button>
        ))}
      </div>

      {/* Food list */}
      <div className="mt-3 space-y-0.5">
        {filtered.map((food, i) => {
          const isCustom = !!foods.find((f) => f.id === food.id);
          return (
            <motion.div key={food.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.01 }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors group">
              <Utensils size={12} className="text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{food.name}</p>
                <p className="text-[9px] text-muted-foreground">
                  {food.servingLabel} · {food.calories} kcal · P{food.protein} C{food.carbs} F{food.fat} · Fiber {food.fiber}g
                </p>
              </div>
              <span className="text-[8px] text-muted-foreground/40">{food.category}</span>
              {isCustom && (
                <button onClick={() => deleteCustomFood(food.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground/40 hover:text-destructive">
                  <Trash2 size={12} />
                </button>
              )}
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-6">No foods found</p>
        )}
      </div>

      <div className="h-8" />
    </>
  );
}
