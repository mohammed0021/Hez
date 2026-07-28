'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, AlertTriangle } from 'lucide-react';
import { useSupplementStore, type Supplement } from '@/stores/supplement-store';

const COLOR_OPTIONS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-amber-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-lime-500',
];

export default function ManageSupplementsPage() {
  const supplements = useSupplementStore((s) => s.supplements);
  const addSupplement = useSupplementStore((s) => s.addSupplement);
  const updateSupplement = useSupplementStore((s) => s.updateSupplement);
  const deleteSupplement = useSupplementStore((s) => s.deleteSupplement);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    time: '',
    stock: 30,
    refillThreshold: 5,
    color: 'bg-blue-500',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaults = supplements.filter((s) => s.isDefault);
  const custom = supplements.filter((s) => !s.isDefault);
  const needsRefill = supplements.filter((s) => s.stock <= s.refillThreshold);

  const handleSave = () => {
    if (!form.name || !form.dosage) return;
    if (editingId) {
      updateSupplement(editingId, form);
    } else {
      addSupplement(form);
    }
    setForm({
      name: '',
      dosage: '',
      time: '',
      stock: 30,
      refillThreshold: 5,
      color: 'bg-blue-500',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (s: Supplement) => {
    setForm({
      name: s.name,
      dosage: s.dosage,
      time: s.time,
      stock: s.stock,
      refillThreshold: s.refillThreshold,
      color: s.color,
    });
    setEditingId(s.id);
    setShowForm(true);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Manage Supplements</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{supplements.length} supplements</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm({
              name: '',
              dosage: '',
              time: '',
              stock: 30,
              refillThreshold: 5,
              color: 'bg-blue-500',
            });
          }}
          className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Refill alerts */}
      {needsRefill.length > 0 && (
        <div className="mt-4 space-y-1">
          <p className="text-muted-foreground/60 mb-1 text-[10px] font-medium tracking-wider uppercase">
            Needs Refill
          </p>
          {needsRefill.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[10px] text-amber-600"
            >
              <AlertTriangle size={12} />
              <span className="flex-1">{s.name}</span>
              <span>{s.stock} left</span>
              <button
                onClick={() => updateSupplement(s.id, { stock: s.stock + s.refillThreshold * 2 })}
                className="min-h-[44px] rounded-lg bg-amber-500/20 px-2 py-0.5 text-[9px] font-medium text-amber-700"
              >
                Restock
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/50 bg-card mt-4 space-y-3 rounded-2xl border p-4"
        >
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
            placeholder="Supplement name"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={form.dosage}
              onChange={(e) => setForm({ ...form, dosage: e.target.value })}
              className="border-border/30 bg-background text-foreground focus:border-primary/40 rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
              placeholder="Dosage (e.g. 5g)"
            />
            <input
              type="text"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="border-border/30 bg-background text-foreground focus:border-primary/40 rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
              placeholder="Time (e.g. Morning)"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-muted-foreground mb-0.5 block text-[9px] font-medium">
                Stock count
              </label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground mb-0.5 block text-[9px] font-medium">
                Refill at
              </label>
              <input
                type="number"
                value={form.refillThreshold}
                onChange={(e) =>
                  setForm({ ...form, refillThreshold: parseInt(e.target.value) || 0 })
                }
                className="border-border/30 bg-background text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-muted-foreground mb-1 block text-[9px] font-medium">Color</label>
            <div className="flex gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className={`size-7 rounded-full ${c} ${form.color === c ? 'ring-primary ring-offset-background ring-2 ring-offset-2' : ''}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
              className="bg-muted text-foreground min-h-[44px] flex-1 rounded-xl py-2.5 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-primary text-primary-foreground min-h-[44px] flex-1 rounded-xl py-2.5 text-xs font-medium"
            >
              {editingId ? 'Update' : 'Add Supplement'}
            </button>
          </div>
        </motion.div>
      )}

      {/* Default supplements */}
      <div className="mt-6">
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          Default
        </p>
        <div className="space-y-1">
          {defaults.map((s) => (
            <SupplementManageRow key={s.id} supplement={s} onEdit={() => startEdit(s)} />
          ))}
        </div>
      </div>

      {/* Custom supplements */}
      {custom.length > 0 && (
        <div className="mt-5">
          <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
            Custom
          </p>
          <div className="space-y-1">
            {custom.map((s) => (
              <SupplementManageRow
                key={s.id}
                supplement={s}
                onEdit={() => startEdit(s)}
                onDelete={() => deleteSupplement(s.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="h-8" />
    </>
  );
}

function SupplementManageRow({
  supplement: s,
  onEdit,
  onDelete,
}: {
  supplement: Supplement;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="hover:bg-muted/50 group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors"
      onClick={onEdit}
    >
      <div className={`size-3 rounded-full ${s.color} shrink-0`} />
      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-semibold">{s.name}</p>
        <p className="text-muted-foreground text-[9px]">
          {s.dosage} · {s.time} · Stock: {s.stock}
        </p>
      </div>
      {!s.isDefault && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={13} />
        </button>
      )}
    </motion.div>
  );
}
