import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLevel, ACHIEVEMENTS, CHALLENGES, XP_REWARDS } from '@/lib/gamification-types';

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export interface ChallengeProgress {
  challengeId: string;
  current: number;
  completedAt: string | null;
  period: string;
}

export interface XpEvent {
  date: string;
  amount: number;
  reason: string;
}

export interface StreakMilestone {
  days: number;
  unlockedAt: string;
}

function getDateKey(date?: Date): string {
  return (date || new Date()).toISOString().slice(0, 10);
}

function getWeekKey(date?: Date): string {
  const d = date || new Date();
  const start = new Date(d);
  start.setDate(start.getDate() - start.getDay());
  return getDateKey(start);
}

function getMonthKey(date?: Date): string {
  const d = date || new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

interface NewXpResult {
  newXp: number;
  leveledUp: boolean;
  newLevel: number;
  unlockedAchievements: UnlockedAchievement[];
  completedChallenges: string[];
  totalXp: number;
}

interface GamificationState {
  xp: number;
  xpHistory: XpEvent[];
  achievements: UnlockedAchievement[];
  challenges: ChallengeProgress[];
  streakMilestones: StreakMilestone[];
  prCelebrations: string[];
  lastLoginDate: string;

  addXp: (amount: number, reason: string) => NewXpResult;
  checkAchievements: (force?: boolean) => UnlockedAchievement[];
  checkChallenges: () => string[];
  getChallengeProgress: (challengeId: string) => ChallengeProgress | undefined;
  recordLogin: () => void;
  celebratePr: (exerciseName: string) => void;
  clearPrCelebrations: () => void;
  getLevel: () => { level: number; currentXp: number; nextXp: number; progress: number };
  getTotalWorkouts: () => number;
  getTotalVolume: () => number;
  getCurrentStreak: () => number;
  reset: () => void;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      xpHistory: [],
      achievements: [],
      challenges: [],
      streakMilestones: [],
      prCelebrations: [],
      lastLoginDate: '',

      addXp: (amount, reason) => {
        const state = get();
        const newTotal = state.xp + amount;
        const oldLevel = getLevel(state.xp).level;
        set((s) => ({
          xp: newTotal,
          xpHistory: [...s.xpHistory, { date: getDateKey(), amount, reason }].slice(-500),
        }));

        const result: NewXpResult = {
          newXp: amount,
          leveledUp: false,
          newLevel: oldLevel,
          unlockedAchievements: [],
          completedChallenges: [],
          totalXp: newTotal,
        };

        const newLevel = getLevel(newTotal).level;
        if (newLevel > oldLevel) {
          result.leveledUp = true;
          result.newLevel = newLevel;
        }

        const unlocked = get().checkAchievements();
        result.unlockedAchievements = unlocked;

        return result;
      },

      checkAchievements: (force) => {
        const state = get();
        const sessionCount = state.xpHistory.filter((e) =>
          e.reason.startsWith('workout_complete'),
        ).length;
        const totalVolume = state.xpHistory
          .filter((e) => e.reason.startsWith('workout_volume'))
          .reduce((s, e) => s + e.amount, 0);
        const level = getLevel(state.xp).level;
        const weightLogs = state.xpHistory.filter((e) => e.reason === 'weight_log').length;
        const measurementLogs = state.xpHistory.filter(
          (e) => e.reason === 'measurement_log',
        ).length;
        const mealLogs = state.xpHistory.filter((e) => e.reason === 'meal_log').length;
        const supplementDays = new Set(
          state.xpHistory.filter((e) => e.reason === 'supplement_log').map((e) => e.date),
        ).size;
        const prCount = state.prCelebrations.length;
        const currentStreak = get().getCurrentStreak();

        const conditions: Record<string, boolean> = {
          first_workout: sessionCount >= 1,
          dedicated: sessionCount >= 7,
          warrior: sessionCount >= 30,
          legend: sessionCount >= 100,
          volume_master: totalVolume >= 10000,
          volume_legend: totalVolume >= 100000,
          perfect_week: false,
          perfect_month: false,
          early_bird: false,
          night_owl: false,
          streak_3: currentStreak >= 3,
          streak_7: currentStreak >= 7,
          streak_30: currentStreak >= 30,
          streak_100: currentStreak >= 100,
          weight_tracker: weightLogs >= 7,
          measurement_pro: measurementLogs >= 5,
          nutrition_logger: mealLogs >= 30,
          supplement_king: supplementDays >= 30,
          pr_king: prCount >= 10,
          explorer: false,
          marathon: false,
          speed_demon: false,
          level_5: level >= 5,
          level_10: level >= 10,
          level_20: level >= 20,
        };

        if (force) {
          const activePerf = countWorkoutsInPeriod(state.xpHistory, 7);
          conditions.perfect_week = activePerf >= 5;
          const monthPerf = countWorkoutsInPeriod(state.xpHistory, 30);
          conditions.perfect_month = monthPerf >= 20;
        }

        const existing = new Set(state.achievements.map((a) => a.id));
        const unlocked: UnlockedAchievement[] = [];

        for (const ach of ACHIEVEMENTS) {
          if (conditions[ach.id] && !existing.has(ach.id)) {
            unlocked.push({ id: ach.id, unlockedAt: new Date().toISOString() });
          }
        }

        if (unlocked.length > 0) {
          const xpBonus = unlocked.reduce((s, a) => {
            const def = ACHIEVEMENTS.find((d) => d.id === a.id);
            return s + (def?.xpReward || 0);
          }, 0);
          set((s) => ({
            achievements: [...s.achievements, ...unlocked],
            xp: s.xp + xpBonus,
            xpHistory: unlocked
              .map((a) => ({
                date: getDateKey(),
                amount: ACHIEVEMENTS.find((d) => d.id === a.id)?.xpReward || 0,
                reason: `achievement_${a.id}`,
              }))
              .concat(s.xpHistory)
              .slice(0, 500),
          }));
        }

        return unlocked;
      },

      checkChallenges: () => {
        const state = get();
        const completed: string[] = [];
        const todayKey = getDateKey();
        const weekKey = getWeekKey();
        const monthKey = getMonthKey();

        const todayWorkoutCount = state.xpHistory.filter(
          (e) => e.date === todayKey && e.reason.startsWith('workout_set'),
        ).length;
        const todayVolume = state.xpHistory
          .filter((e) => e.date === todayKey && e.reason.startsWith('workout_volume'))
          .reduce((s, e) => s + e.amount, 0);
        const todayMeals = state.xpHistory.filter(
          (e) => e.date === todayKey && e.reason === 'meal_log',
        ).length;
        const todayWeight = state.xpHistory.filter(
          (e) => e.date === todayKey && e.reason === 'weight_log',
        ).length;
        const todaySupplementsLogged =
          state.xpHistory.filter((e) => e.date === todayKey && e.reason === 'supplement_log')
            .length > 0;
        const todayWater = state.xpHistory.filter(
          (e) => e.date === todayKey && e.reason.startsWith('water'),
        ).length;

        const weekWorkouts = state.xpHistory.filter(
          (e) => e.date >= weekKey && e.reason.startsWith('workout_complete'),
        ).length;
        const weekVolume = state.xpHistory
          .filter((e) => e.date >= weekKey && e.reason.startsWith('workout_volume'))
          .reduce((s, e) => s + e.amount, 0);
        const weekDays = new Set(
          state.xpHistory
            .filter((e) => e.date >= weekKey && e.reason.startsWith('workout_complete'))
            .map((e) => e.date),
        ).size;
        const currentStreak = get().getCurrentStreak();

        const monthWorkouts = state.xpHistory.filter(
          (e) => e.date >= monthKey && e.reason.startsWith('workout_complete'),
        ).length;
        const monthVolume = state.xpHistory
          .filter((e) => e.date >= monthKey && e.reason.startsWith('workout_volume'))
          .reduce((s, e) => s + e.amount, 0);
        const monthSets = state.xpHistory.filter(
          (e) => e.date >= monthKey && e.reason.startsWith('workout_set'),
        ).length;
        const monthMeals = state.xpHistory.filter(
          (e) => e.date >= monthKey && e.reason === 'meal_log',
        ).length;

        const dailyProgress: Record<string, number> = {
          ch_daily_workout: weekWorkouts > 0 ? 1 : 0,
          ch_daily_sets: todayWorkoutCount,
          ch_daily_volume: todayVolume,
          ch_daily_supplements: todaySupplementsLogged ? 1 : 0,
          ch_daily_water: todayWater > 0 ? 1 : 0,
          ch_daily_meal: todayMeals,
          ch_daily_weight: todayWeight,
        };

        const weeklyProgress: Record<string, number> = {
          ch_weekly_workouts_3: weekWorkouts,
          ch_weekly_workouts_5: weekWorkouts,
          ch_weekly_volume: weekVolume,
          ch_weekly_days: weekDays,
          ch_weekly_streak: currentStreak,
        };

        const monthlyProgress: Record<string, number> = {
          ch_monthly_workouts: monthWorkouts,
          ch_monthly_volume: monthVolume,
          ch_monthly_sets: monthSets,
          ch_monthly_streak: currentStreak,
          ch_monthly_meals: monthMeals,
        };

        const periodMap: Record<string, string> = {
          ...Object.fromEntries(
            CHALLENGES.filter((c) => c.frequency === 'daily').map((c) => [c.id, todayKey]),
          ),
          ...Object.fromEntries(
            CHALLENGES.filter((c) => c.frequency === 'weekly').map((c) => [c.id, weekKey]),
          ),
          ...Object.fromEntries(
            CHALLENGES.filter((c) => c.frequency === 'monthly').map((c) => [c.id, monthKey]),
          ),
        };

        const allProgress = { ...dailyProgress, ...weeklyProgress, ...monthlyProgress };

        for (const challenge of CHALLENGES) {
          const current = allProgress[challenge.id] || 0;
          const period = periodMap[challenge.id] || todayKey;
          const existing = state.challenges.find(
            (c) => c.challengeId === challenge.id && c.period === period,
          );
          const capped = Math.min(current, challenge.target);

          if (!existing) {
            const prog: ChallengeProgress = {
              challengeId: challenge.id,
              current: capped,
              completedAt: capped >= challenge.target ? new Date().toISOString() : null,
              period,
            };
            set((s) => ({ challenges: [...s.challenges, prog] }));

            if (capped >= challenge.target) {
              completed.push(challenge.id);
            }
          } else if (current > existing.current) {
            const newCurrent = Math.min(current, challenge.target);
            const wasCompleted = !!existing.completedAt;
            const nowCompleted = newCurrent >= challenge.target;

            set((s) => ({
              challenges: s.challenges.map((c) =>
                c.challengeId === challenge.id && c.period === period
                  ? {
                      ...c,
                      current: newCurrent,
                      completedAt: nowCompleted ? new Date().toISOString() : c.completedAt,
                    }
                  : c,
              ),
            }));

            if (nowCompleted && !wasCompleted) {
              completed.push(challenge.id);
            }
          }
        }

        if (completed.length > 0) {
          const xpBonus = completed.reduce((s, id) => {
            const def = CHALLENGES.find((c) => c.id === id);
            return s + (def?.xpReward || 0);
          }, 0);
          set((state) => ({
            xp: state.xp + xpBonus,
            xpHistory: completed
              .map((id) => ({
                date: getDateKey(),
                amount: CHALLENGES.find((c) => c.id === id)?.xpReward || 0,
                reason: `challenge_${id}`,
              }))
              .concat(state.xpHistory)
              .slice(0, 500),
          }));
        }

        return completed;
      },

      getChallengeProgress: (challengeId) => {
        const def = CHALLENGES.find((c) => c.id === challengeId);
        if (!def) return undefined;
        const period =
          def.frequency === 'daily'
            ? getDateKey()
            : def.frequency === 'weekly'
              ? getWeekKey()
              : getMonthKey();
        return get().challenges.find((c) => c.challengeId === challengeId && c.period === period);
      },

      recordLogin: () => {
        const today = getDateKey();
        const state = get();
        if (state.lastLoginDate !== today) {
          const result = get().addXp(XP_REWARDS.daily_login, 'daily_login');
          set({ lastLoginDate: today });
          return result;
        }
        return null;
      },

      celebratePr: (exerciseName) => {
        set((s) => ({
          prCelebrations: [
            ...s.prCelebrations,
            `${exerciseName}|${new Date().toISOString()}`,
          ].slice(-50),
        }));
        get().addXp(XP_REWARDS.pr_achieved, `pr_${exerciseName}`);
      },

      clearPrCelebrations: () => set({ prCelebrations: [] }),

      getLevel: () => getLevel(get().xp),

      getTotalWorkouts: () => {
        return new Set(
          get()
            .xpHistory.filter((e) => e.reason.startsWith('workout_complete'))
            .map((e) => e.date),
        ).size;
      },

      getTotalVolume: () => {
        return get()
          .xpHistory.filter((e) => e.reason.startsWith('workout_volume'))
          .reduce((s, e) => s + e.amount, 0);
      },

      getCurrentStreak: () => {
        const dates = new Set(
          get()
            .xpHistory.filter((e) => e.reason.startsWith('workout_complete'))
            .map((e) => e.date),
        );
        if (dates.size === 0) return 0;
        const sorted = Array.from(dates).sort().reverse();
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < sorted.length; i++) {
          const expected = new Date(today);
          expected.setDate(expected.getDate() - i);
          const expectedStr = getDateKey(expected);
          if (
            sorted[i] === expectedStr ||
            (i === 0 && sorted[i] === getDateKey(new Date(today.getTime() - 86400000)))
          ) {
            streak++;
          } else {
            break;
          }
        }
        return streak;
      },

      reset: () =>
        set({
          xp: 0,
          xpHistory: [],
          achievements: [],
          challenges: [],
          streakMilestones: [],
          prCelebrations: [],
          lastLoginDate: '',
        }),
    }),
    {
      name: 'hez-gamification-store',
      partialize: (s) => ({
        xp: s.xp,
        xpHistory: s.xpHistory,
        achievements: s.achievements,
        challenges: s.challenges,
        streakMilestones: s.streakMilestones,
        prCelebrations: s.prCelebrations,
        lastLoginDate: s.lastLoginDate,
      }),
    },
  ),
);

function countWorkoutsInPeriod(history: XpEvent[], days: number): number {
  const cutoff = getDateKey(new Date(Date.now() - days * 86400000));
  return new Set(
    history
      .filter((e) => e.date >= cutoff && e.reason.startsWith('workout_complete'))
      .map((e) => e.date),
  ).size;
}
