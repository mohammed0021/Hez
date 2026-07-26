'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  Dumbbell,
  Zap,
  Flame,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Target,
  Medal,
} from 'lucide-react';
import { useGamificationStore } from '@/stores/gamification-store';
import { ACHIEVEMENTS, CHALLENGES, getLevel } from '@/lib/gamification-types';
import { XpBar } from '@/components/gamification/xp-bar';
import { AchievementCard } from '@/components/gamification/achievement-card';
import { ChallengeCard } from '@/components/gamification/challenge-card';

type Tab = 'overview' | 'achievements' | 'challenges';

export default function GamificationPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  const xp = useGamificationStore((s) => s.xp);
  const achievements = useGamificationStore((s) => s.achievements);
  const getTotalWorkouts = useGamificationStore((s) => s.getTotalWorkouts);
  const getCurrentStreak = useGamificationStore((s) => s.getCurrentStreak);
  const xpHistory = useGamificationStore((s) => s.xpHistory);

  const level = getLevel(xp);
  const unlockedIds = new Set(achievements.map((a) => a.id));
  const unlockedCount = unlockedIds.size;

  const dailyChallenges = useMemo(() => CHALLENGES.filter((c) => c.frequency === 'daily'), []);
  const weeklyChallenges = useMemo(() => CHALLENGES.filter((c) => c.frequency === 'weekly'), []);
  const monthlyChallenges = useMemo(() => CHALLENGES.filter((c) => c.frequency === 'monthly'), []);

  const recentXp = useMemo(() => {
    return xpHistory.slice(-20).reverse();
  }, [xpHistory]);

  const getChallengeProgress = useGamificationStore((s) => s.getChallengeProgress);

  const levelProgress = (level.currentXp / level.nextXp) * 100;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Gamification</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Track your achievements and progress
          </p>
        </div>
        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-sm font-bold text-amber-500">
          {level.level}
        </div>
      </div>

      {/* XP Bar */}
      <div className="border-border/50 bg-card mt-4 rounded-2xl border p-4">
        <XpBar size="lg" />
      </div>

      {/* Stats grid */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { icon: Dumbbell, label: 'Workouts', value: getTotalWorkouts(), color: 'text-primary' },
          { icon: Zap, label: 'Streak', value: `${getCurrentStreak()}d`, color: 'text-amber-500' },
          { icon: Flame, label: 'Level', value: level.level, color: 'text-orange-500' },
          {
            icon: Trophy,
            label: 'Badges',
            value: `${unlockedCount}/${ACHIEVEMENTS.length}`,
            color: 'text-purple-500',
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="border-border/50 bg-card rounded-xl border p-2.5 text-center"
          >
            <s.icon size={14} className={`mx-auto ${s.color}`} />
            <p className="text-foreground mt-0.5 text-sm font-bold tabular-nums">{s.value}</p>
            <p className="text-muted-foreground text-[8px] tracking-wider uppercase">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="bg-muted mt-4 flex gap-1 rounded-xl p-1">
        {[
          { id: 'overview' as const, label: 'Overview', icon: Sparkles },
          { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
          { id: 'challenges' as const, label: 'Challenges', icon: Target },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${
                tab === t.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-4 space-y-4">
        {tab === 'overview' && (
          <>
            {/* Recent XP */}
            <div className="border-border/50 bg-card rounded-2xl border p-4">
              <p className="text-foreground mb-3 flex items-center gap-1.5 text-xs font-semibold">
                <TrendingUp size={14} className="text-amber-500" /> Recent Activity
              </p>
              <div className="max-h-48 space-y-1.5 overflow-y-auto">
                {recentXp.length === 0 ? (
                  <p className="text-muted-foreground py-4 text-center text-[10px]">
                    No activity yet. Start working out!
                  </p>
                ) : (
                  recentXp.map((e, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex min-w-0 items-center gap-2">
                        <Sparkles size={8} className="shrink-0 text-amber-500" />
                        <span className="text-foreground truncate text-[10px]">
                          {e.reason.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="text-[10px] font-medium text-amber-600">+{e.amount}</span>
                        <span className="text-muted-foreground text-[8px]">{e.date.slice(5)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Level progress */}
            <div className="border-border/50 bg-card rounded-2xl border p-4">
              <p className="text-foreground mb-2 text-xs font-semibold">Level Progress</p>
              <div className="space-y-1.5">
                {Array.from({ length: 5 }, (_, i) => {
                  const lvl = Math.max(1, level.level - 2 + i);
                  const req = 50 * lvl * (lvl + 1);
                  const isCurrent = lvl === level.level;
                  const isUnlocked = lvl <= level.level;
                  const fill = isCurrent ? levelProgress : isUnlocked ? 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold ${
                          isUnlocked
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {lvl}
                      </div>
                      <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCurrent
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                              : isUnlocked
                                ? 'bg-green-500'
                                : 'bg-muted-foreground/20'
                          }`}
                          style={{ width: `${fill}%` }}
                        />
                      </div>
                      <span
                        className={`w-12 text-right text-[9px] tabular-nums ${
                          isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        {req.toLocaleString()} XP
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unlocked achievements mini list */}
            {achievements.length > 0 && (
              <div className="border-border/50 bg-card rounded-2xl border p-4">
                <p className="text-foreground mb-3 flex items-center gap-1.5 text-xs font-semibold">
                  <Trophy size={14} className="text-amber-500" /> Recent Badges
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {achievements
                    .slice(-8)
                    .reverse()
                    .map((a) => {
                      const def = ACHIEVEMENTS.find((d) => d.id === a.id);
                      if (!def) return null;
                      return (
                        <div
                          key={a.id}
                          className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-1"
                        >
                          <Sparkles size={8} className="text-amber-500" />
                          <span className="text-[9px] font-medium text-amber-700">{def.title}</span>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        )}

        {tab === 'achievements' && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                {unlockedCount} of {ACHIEVEMENTS.length} unlocked
              </p>
              <button
                onClick={() => setShowAllAchievements(!showAllAchievements)}
                className="text-primary flex items-center gap-1 text-[10px] font-medium"
              >
                {showAllAchievements ? 'Hide locked' : 'Show all'}
                {showAllAchievements ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>
            <div className="space-y-1.5">
              {ACHIEVEMENTS.filter((a) => showAllAchievements || unlockedIds.has(a.id)).map(
                (a, i) => (
                  <AchievementCard
                    key={a.id}
                    def={a}
                    unlocked={achievements.find((u) => u.id === a.id)}
                    index={i}
                  />
                ),
              )}
            </div>
          </>
        )}

        {tab === 'challenges' && (
          <>
            {/* Daily */}
            <div>
              <p className="text-muted-foreground/60 mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase">
                <Flame size={12} className="text-orange-500" /> Daily
              </p>
              <div className="space-y-1.5">
                {dailyChallenges.map((c, i) => (
                  <ChallengeCard
                    key={c.id}
                    def={c}
                    progress={getChallengeProgress(c.id)}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Weekly */}
            <div className="mt-4">
              <p className="text-muted-foreground/60 mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase">
                <Calendar size={12} className="text-blue-500" /> Weekly
              </p>
              <div className="space-y-1.5">
                {weeklyChallenges.map((c, i) => (
                  <ChallengeCard
                    key={c.id}
                    def={c}
                    progress={getChallengeProgress(c.id)}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Monthly */}
            <div className="mt-4">
              <p className="text-muted-foreground/60 mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase">
                <Medal size={12} className="text-purple-500" /> Monthly
              </p>
              <div className="space-y-1.5">
                {monthlyChallenges.map((c, i) => (
                  <ChallengeCard
                    key={c.id}
                    def={c}
                    progress={getChallengeProgress(c.id)}
                    index={i}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="h-8" />
    </>
  );
}
