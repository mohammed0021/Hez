'use client';

import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pill, Check, Flame, CalendarDays, AlertTriangle, Bell, BellOff, History, Settings } from 'lucide-react';
import Link from 'next/link';
import { useSupplementStore } from '@/stores/supplement-store';
import type { Supplement } from '@/stores/supplement-store';
import { canNotify, notify } from '@/lib/notification-service';

export default function SupplementsPage() {
  const supplements = useSupplementStore((s) => s.supplements);
  const getTodayLog = useSupplementStore((s) => s.getTodayLog);
  const markTaken = useSupplementStore((s) => s.markTaken);
  const unmark = useSupplementStore((s) => s.unmark);
  const getStreak = useSupplementStore((s) => s.getStreak);
  const getMissedThisWeek = useSupplementStore((s) => s.getMissedThisWeek);
  const getStockStatus = useSupplementStore((s) => s.getStockStatus);
  const reminder = useSupplementStore((s) => s.reminder);
  const setReminder = useSupplementStore((s) => s.setReminder);

  const todayLog = getTodayLog();
  const streak = getStreak();
  const missed = getMissedThisWeek();
  const stockStatus = getStockStatus();

  const takenCount = supplements.filter((s) => todayLog[s.id] === 'taken').length;
  const needsRefill = stockStatus.filter((s) => s.supplement.stock <= s.supplement.refillThreshold);
  const allTaken = takenCount === supplements.length;

  const requestNotify = useCallback(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => { requestNotify(); }, [requestNotify]);

  useEffect(() => {
    if (!reminder.enabled) return;
    const check = setInterval(() => {
      const state = useSupplementStore.getState();
      const now = new Date();
      if (now.getHours() === state.reminder.hour && now.getMinutes() === state.reminder.minute) {
        const missed = state.supplements.filter((s) => state.getTodayLog()[s.id] !== 'taken');
        if (missed.length > 0) {
          if (canNotify()) {
            notify('Supplements Reminder', {
              body: `You still need to take: ${missed.map((s) => s.name).join(', ')}`,
              tag: 'supplement-reminder',
              data: { type: 'creatine_reminder' },
              onClick: () => {
                for (const s of missed) {
                  state.markTaken(s.id);
                }
              },
            });
          } else if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('Supplements Reminder', {
              body: `You still need to take: ${missed.map((s) => s.name).join(', ')}`,
              icon: '/icons/icon-192x192.png',
              tag: 'supplement-reminder',
              requireInteraction: true,
            });
            notification.onclick = () => {
              window.focus();
              for (const s of missed) {
                state.markTaken(s.id);
              }
            };
          }
        }
      }
    }, 60000);
    return () => clearInterval(check);
  }, [reminder]);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supplements</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{takenCount}/{supplements.length} taken today</p>
        </div>
        <div className="flex gap-2">
          <Link href="/supplements/manage" className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80">
            <Settings size={14} /> Manage
          </Link>
          <Link href="/supplements/history" className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-muted/80">
            <History size={14} /> History
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border/40 bg-card p-3 text-center">
          <Flame size={16} className="mx-auto text-orange-500" />
          <p className="mt-1 text-lg font-bold text-foreground">{streak}</p>
          <p className="text-[9px] text-muted-foreground">Day Streak</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}
          className="rounded-xl border border-border/40 bg-card p-3 text-center">
          <Check size={16} className="mx-auto text-green-500" />
          <p className="mt-1 text-lg font-bold text-foreground">{takenCount}/{supplements.length}</p>
          <p className="text-[9px] text-muted-foreground">Today</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="rounded-xl border border-border/40 bg-card p-3 text-center">
          <CalendarDays size={16} className="mx-auto text-blue-500" />
          <p className="mt-1 text-lg font-bold text-foreground">{missed.length}</p>
          <p className="text-[9px] text-muted-foreground">Missed This Week</p>
        </motion.div>
      </div>

      {/* All taken celebration */}
      {allTaken && supplements.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mt-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 p-4 text-center">
          <Check size={24} className="mx-auto text-green-500" />
          <p className="mt-1 text-sm font-semibold text-green-600">All supplements taken today!</p>
          <p className="text-[10px] text-green-600/70">Streak: {streak} day{streak !== 1 ? 's' : ''}</p>
        </motion.div>
      )}

      {/* Refill alerts */}
      {needsRefill.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-1">
          {needsRefill.map(({ supplement: s }) => (
            <Link key={s.id} href="/supplements/manage"
              className="flex items-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-[10px] text-amber-600 hover:bg-amber-500/20 transition-colors">
              <AlertTriangle size={12} />
              <span className="flex-1">{s.name} running low ({s.stock} left)</span>
              <span>Refill</span>
            </Link>
          ))}
        </motion.div>
      )}

      {/* Supplement list */}
      <div className="mt-5 space-y-1.5">
        {supplements.map((s, i) => {
          const status = todayLog[s.id];
          const taken = status === 'taken';
          return (
            <SupplementRow key={s.id} supplement={s} taken={taken}
              onToggle={() => taken ? unmark(s.id) : markTaken(s.id)} index={i} />
          );
        })}
      </div>

      {/* Quick mark all */}
      {!allTaken && supplements.length > 0 && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={() => {
            for (const s of supplements) {
              if (todayLog[s.id] !== 'taken') markTaken(s.id);
            }
            if (canNotify()) {
              notify('All Supplements Taken', { body: 'Great job staying on track!', tag: 'all-taken' });
            } else if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('All Supplements Taken', { body: 'Great job staying on track!', icon: '/icons/icon-192x192.png' });
            }
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-medium text-primary-foreground active:scale-[0.98] transition-transform">
          <Check size={14} /> Mark All as Taken
        </motion.button>
      )}

      {/* Reminder toggle */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="mt-5 flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4">
        {reminder.enabled ? <Bell size={18} className="text-primary" /> : <BellOff size={18} className="text-muted-foreground" />}
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Daily Reminder</p>
          <p className="text-[10px] text-muted-foreground">{reminder.hour.toString().padStart(2, '0')}:{reminder.minute.toString().padStart(2, '0')}</p>
        </div>
        <button onClick={() => setReminder({ enabled: !reminder.enabled })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reminder.enabled ? 'bg-primary' : 'bg-muted'}`}>
          <span className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${reminder.enabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
      </motion.div>

      {/* Reminder time picker */}
      {reminder.enabled && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-4 mt-2">
          <span className="text-xs text-foreground flex-1">Reminder time</span>
          <select value={reminder.hour} onChange={(e) => setReminder({ hour: parseInt(e.target.value) })}
            className="rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground">
            {Array.from({ length: 24 }, (_, i) => i).map((h) => (
              <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">:</span>
          <select value={reminder.minute} onChange={(e) => setReminder({ minute: parseInt(e.target.value) })}
            className="rounded-xl border border-border/30 bg-background px-3 py-2 text-xs text-foreground">
            {[0, 15, 30, 45].map((m) => (
              <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
            ))}
          </select>
        </motion.div>
      )}

      <div className="h-8" />
    </>
  );
}

function SupplementRow({ supplement: s, taken, onToggle, index }: { supplement: Supplement; taken: boolean; onToggle: () => void; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
      className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-3.5">
      <button onClick={onToggle}
        className={`flex size-11 items-center justify-center rounded-xl transition-all active:scale-90 ${
          taken ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-muted text-muted-foreground'
        }`}>
        {taken ? <Check size={20} /> : <Pill size={18} />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${taken ? 'text-foreground' : 'text-muted-foreground'}`}>{s.name}</p>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 mt-0.5">
          <span>{s.dosage}</span>
          <span>·</span>
          <span>{s.time}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[9px] text-muted-foreground/40">Stock: {s.stock}</span>
        {s.stock <= s.refillThreshold && <AlertTriangle size={11} className="text-amber-500" />}
      </div>
    </motion.div>
  );
}
