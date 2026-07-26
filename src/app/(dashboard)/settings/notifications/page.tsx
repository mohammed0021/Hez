'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BellOff,
  Dumbbell,
  Clock,
  Pill,
  Droplets,
  Apple,
  Moon,
  Timer,
  CalendarCheck,
  BarChart3,
  LineChart,
  Trophy,
  Info,
  Volume2,
  Vibrate,
  MoonStar,
  RotateCcw,
} from 'lucide-react';
import { useNotificationStore } from '@/stores/notification-store';
import { NOTIFICATION_TYPES } from '@/lib/notification-types';
import {
  subscribeToPush,
  unsubscribeFromPush,
  isPushSupported,
  requestPermission,
} from '@/lib/notification-service';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Dumbbell,
  Clock,
  Pill,
  Droplets,
  Apple,
  Moon,
  Timer,
  CalendarCheck,
  BarChart3,
  LineChart,
  Trophy,
};

export default function NotificationsSettingsPage() {
  const store = useNotificationStore();
  const [pushStatus, setPushStatus] = useState<'idle' | 'subscribing' | 'subscribed' | 'error'>(
    'idle',
  );
  const [browserPerm, setBrowserPerm] = useState<NotificationPermission>(() =>
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default',
  );
  const [testSent, setTestSent] = useState(false);

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    setBrowserPerm(result);
  };

  const handleTogglePush = async () => {
    if (pushStatus === 'subscribed') {
      await unsubscribeFromPush();
      setPushStatus('idle');
    } else {
      setPushStatus('subscribing');
      const sub = await subscribeToPush();
      setPushStatus(sub ? 'subscribed' : 'error');
    }
  };

  const handleSendTest = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hêz Test Notification', {
        body: 'This is a test notification from your notification settings.',
        icon: '/icons/icon-192x192.png',
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Manage all notification preferences
          </p>
        </div>
        <button
          onClick={() => {
            store.resetAll();
            setPushStatus('idle');
          }}
          className="bg-muted text-foreground hover:bg-muted/80 flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {/* Global toggle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-border/50 bg-card flex items-center gap-4 rounded-2xl border p-4"
        >
          {store.globalEnabled ? (
            <Bell size={20} className="text-primary" />
          ) : (
            <BellOff size={20} className="text-muted-foreground" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-foreground text-sm font-medium">Push Notifications</p>
            <p className="text-muted-foreground text-[10px]">Master toggle for all notifications</p>
          </div>
          <button
            onClick={() => store.setGlobalEnabled(!store.globalEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${store.globalEnabled ? 'bg-primary' : 'bg-muted'}`}
          >
            <span
              className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${store.globalEnabled ? 'translate-x-6' : 'translate-x-0.5'}`}
            />
          </button>
        </motion.div>

        {/* Browser permission */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.03 }}
          className="border-border/50 bg-card rounded-2xl border p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info size={16} className="text-muted-foreground" />
              <span className="text-foreground text-sm">Browser Permission</span>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                browserPerm === 'granted'
                  ? 'bg-green-500/10 text-green-600'
                  : browserPerm === 'denied'
                    ? 'bg-red-500/10 text-red-600'
                    : 'bg-amber-500/10 text-amber-600'
              }`}
            >
              {browserPerm === 'granted'
                ? 'Granted'
                : browserPerm === 'denied'
                  ? 'Denied'
                  : 'Not Requested'}
            </span>
          </div>
          {browserPerm !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="bg-primary text-primary-foreground mt-3 w-full rounded-xl py-2.5 text-xs font-medium transition-transform active:scale-[0.98]"
            >
              {browserPerm === 'denied'
                ? 'Open Browser Settings to Enable'
                : 'Enable Notifications'}
            </button>
          )}
        </motion.div>

        {/* Web Push subscription */}
        {isPushSupported() && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="border-border/50 bg-card flex items-center gap-4 rounded-2xl border p-4"
          >
            <Bell size={18} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">Web Push</p>
              <p className="text-muted-foreground text-[10px]">
                {pushStatus === 'subscribed'
                  ? 'Subscribed to push notifications'
                  : pushStatus === 'subscribing'
                    ? 'Subscribing...'
                    : pushStatus === 'error'
                      ? 'Subscription failed'
                      : 'Receive notifications even when the tab is closed'}
              </p>
            </div>
            <button
              onClick={handleTogglePush}
              disabled={pushStatus === 'subscribing'}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                pushStatus === 'subscribed'
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              } disabled:opacity-50`}
            >
              {pushStatus === 'subscribing'
                ? '...'
                : pushStatus === 'subscribed'
                  ? 'Unsubscribe'
                  : 'Subscribe'}
            </button>
          </motion.div>
        )}

        {/* Sound & Vibration */}
        <div className="flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.09 }}
            className="border-border/50 bg-card flex items-center gap-4 rounded-2xl border p-4"
          >
            <Volume2 size={18} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">Sound</p>
              <p className="text-muted-foreground text-[10px]">Play sound with notifications</p>
            </div>
            <button
              onClick={() => store.setSoundEnabled(!store.soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${store.soundEnabled ? 'bg-primary' : 'bg-muted'}`}
            >
              <span
                className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${store.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="border-border/50 bg-card flex items-center gap-4 rounded-2xl border p-4"
          >
            <Vibrate size={18} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">Vibration</p>
              <p className="text-muted-foreground text-[10px]">Vibrate device with notifications</p>
            </div>
            <button
              onClick={() => store.setVibrationEnabled(!store.vibrationEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${store.vibrationEnabled ? 'bg-primary' : 'bg-muted'}`}
            >
              <span
                className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${store.vibrationEnabled ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </motion.div>
        </div>

        {/* Quiet hours */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="border-border/50 bg-card rounded-2xl border p-4"
        >
          <div className="flex items-center gap-4">
            <MoonStar size={18} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-foreground text-sm font-medium">Quiet Hours</p>
              <p className="text-muted-foreground text-[10px]">
                Suppress notifications during selected hours
              </p>
            </div>
            <button
              onClick={() => store.setQuietHours({ enabled: !store.quietHours.enabled })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${store.quietHours.enabled ? 'bg-primary' : 'bg-muted'}`}
            >
              <span
                className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${store.quietHours.enabled ? 'translate-x-6' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
          {store.quietHours.enabled && (
            <div className="mt-3 flex items-center gap-3">
              <select
                value={store.quietHours.start}
                onChange={(e) => store.setQuietHours({ start: e.target.value })}
                className="border-border/30 bg-background text-foreground flex-1 rounded-xl border px-3 py-2 text-xs"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const v = `${i.toString().padStart(2, '0')}:00`;
                  return (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  );
                })}
              </select>
              <span className="text-muted-foreground text-xs">to</span>
              <select
                value={store.quietHours.end}
                onChange={(e) => store.setQuietHours({ end: e.target.value })}
                className="border-border/30 bg-background text-foreground flex-1 rounded-xl border px-3 py-2 text-xs"
              >
                {Array.from({ length: 24 }, (_, i) => {
                  const v = `${i.toString().padStart(2, '0')}:00`;
                  return (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </motion.div>

        {/* Per-type settings */}
        <div className="mt-2">
          <p className="text-muted-foreground/60 mb-2 px-1 text-[10px] font-semibold tracking-widest uppercase">
            Notification Types
          </p>
          <div className="space-y-1.5">
            {NOTIFICATION_TYPES.map((nt, i) => {
              const Icon = ICON_MAP[nt.icon] || Bell;
              const prefs = store.types[nt.id];
              return (
                <motion.div
                  key={nt.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.03 }}
                >
                  <div className="border-border/50 bg-card rounded-2xl border p-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-9 items-center justify-center rounded-xl ${
                          prefs?.enabled
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground text-sm font-medium">{nt.label}</p>
                        <p className="text-muted-foreground text-[10px]">{nt.description}</p>
                      </div>
                      <button
                        onClick={() => store.updateType(nt.id, { enabled: !prefs?.enabled })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${prefs?.enabled ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <span
                          className={`inline-block size-5 rounded-full bg-white shadow-sm transition-transform ${prefs?.enabled ? 'translate-x-6' : 'translate-x-0.5'}`}
                        />
                      </button>
                    </div>

                    {/* Expanded settings */}
                    {prefs?.enabled && (nt.hasTime || nt.hasDays || nt.hasAdvance) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="border-border/30 mt-3 space-y-2.5 border-t pt-3"
                      >
                        {nt.hasTime && (
                          <div className="flex items-center gap-2">
                            <Clock size={12} className="text-muted-foreground" />
                            <span className="text-foreground flex-1 text-[10px]">Time</span>
                            <select
                              value={prefs?.time || nt.defaultTime || '07:00'}
                              onChange={(e) => store.updateType(nt.id, { time: e.target.value })}
                              className="border-border/30 bg-background text-foreground rounded-lg border px-2 py-1.5 text-[10px]"
                            >
                              {Array.from({ length: 48 }, (_, i) => {
                                const h = Math.floor(i / 2);
                                const m = i % 2 === 0 ? '00' : '30';
                                return (
                                  <option key={i} value={`${h.toString().padStart(2, '0')}:${m}`}>
                                    {h.toString().padStart(2, '0')}:{m}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        )}
                        {nt.hasDays && (
                          <div>
                            <span className="text-foreground text-[10px]">Days of Week</span>
                            <div className="mt-1 flex gap-1.5">
                              {daysOfWeek.map((d, di) => (
                                <button
                                  key={di}
                                  onClick={() => {
                                    const current = prefs?.daysOfWeek || nt.defaultDays || [];
                                    const next = current.includes(di)
                                      ? current.filter((x) => x !== di)
                                      : [...current, di].sort();
                                    store.updateType(nt.id, { daysOfWeek: next });
                                  }}
                                  className={`size-7 rounded-lg text-[9px] font-medium transition-colors ${
                                    (prefs?.daysOfWeek || nt.defaultDays || []).includes(di)
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {d[0]}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {nt.hasAdvance && (
                          <div className="flex items-center gap-2">
                            <Timer size={12} className="text-muted-foreground" />
                            <span className="text-foreground flex-1 text-[10px]">
                              Remind before
                            </span>
                            <select
                              value={prefs?.advanceMinutes || nt.defaultAdvanceMinutes || 30}
                              onChange={(e) =>
                                store.updateType(nt.id, {
                                  advanceMinutes: parseInt(e.target.value),
                                })
                              }
                              className="border-border/30 bg-background text-foreground rounded-lg border px-2 py-1.5 text-[10px]"
                            >
                              <option value={15}>15 min</option>
                              <option value={30}>30 min</option>
                              <option value={45}>45 min</option>
                              <option value={60}>1 hour</option>
                            </select>
                          </div>
                        )}
                        <button
                          onClick={() => store.resetType(nt.id)}
                          className="text-muted-foreground hover:text-foreground text-[9px] transition-colors"
                        >
                          Reset to defaults
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Test notification */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4"
        >
          <button
            onClick={handleSendTest}
            className="border-border/60 text-muted-foreground hover:bg-muted/50 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3 text-xs transition-colors"
          >
            <Bell size={14} />
            {testSent ? 'Test notification sent!' : 'Send Test Notification'}
          </button>
        </motion.div>

        <div className="h-8" />
      </div>
    </>
  );
}
