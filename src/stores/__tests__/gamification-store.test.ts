import { describe, it, expect, beforeEach } from 'vitest';
import { useGamificationStore } from '../gamification-store';
import { getLevel } from '@/lib/gamification-types';

beforeEach(() => {
  useGamificationStore.setState({
    xp: 0,
    xpHistory: [],
    achievements: [],
    challenges: [],
    streakMilestones: [],
    prCelebrations: [],
    lastLoginDate: '',
  });
});

describe('gamification store', () => {
  describe('addXp', () => {
    it('adds XP and returns result', () => {
      const result = useGamificationStore.getState().addXp(50, 'test');
      expect(result.newXp).toBe(50);
      expect(result.totalXp).toBe(50);
      expect(result.leveledUp).toBe(false);
      expect(useGamificationStore.getState().xp).toBe(50);
    });

    it('detects level up', () => {
      useGamificationStore.setState({ xp: 90 });
      const result = useGamificationStore.getState().addXp(20, 'test');
      expect(result.leveledUp).toBe(true);
      expect(result.newLevel).toBe(2);
    });

    it('records XP history', () => {
      useGamificationStore.getState().addXp(50, 'workout_complete');
      const history = useGamificationStore.getState().xpHistory;
      expect(history.length).toBeGreaterThanOrEqual(1);
      expect(history.some((e) => e.amount === 50 && e.reason === 'workout_complete')).toBe(true);
    });
  });

  describe('getLevel', () => {
    it('returns level 1 for new user', () => {
      const lvl = useGamificationStore.getState().getLevel();
      expect(lvl.level).toBe(1);
    });

    it('returns higher level with more XP', () => {
      useGamificationStore.setState({ xp: 1600 });
      const lvl = useGamificationStore.getState().getLevel();
      expect(lvl.level).toBeGreaterThan(1);
    });
  });

  describe('getTotalWorkouts', () => {
    it('returns 0 when no workouts', () => {
      expect(useGamificationStore.getState().getTotalWorkouts()).toBe(0);
    });

    it('counts unique workout days', () => {
      const today = new Date().toISOString().slice(0, 10);
      useGamificationStore.setState({
        xpHistory: [
          { date: today, amount: 50, reason: 'workout_complete' },
          { date: today, amount: 30, reason: 'workout_volume' },
        ],
      });
      expect(useGamificationStore.getState().getTotalWorkouts()).toBe(1);
    });
  });

  describe('getCurrentStreak', () => {
    it('returns 0 for no activity', () => {
      expect(useGamificationStore.getState().getCurrentStreak()).toBe(0);
    });

    it('returns 1 for today workout', () => {
      const today = new Date().toISOString().slice(0, 10);
      useGamificationStore.setState({
        xpHistory: [{ date: today, amount: 50, reason: 'workout_complete' }],
      });
      expect(useGamificationStore.getState().getCurrentStreak()).toBe(1);
    });
  });

  describe('getTotalVolume', () => {
    it('returns total volume from history', () => {
      useGamificationStore.setState({
        xpHistory: [
          { date: '2025-01-01', amount: 5000, reason: 'workout_volume' },
          { date: '2025-01-02', amount: 3000, reason: 'workout_volume' },
        ],
      });
      expect(useGamificationStore.getState().getTotalVolume()).toBe(8000);
    });

    it('ignores non-volume entries', () => {
      useGamificationStore.setState({
        xpHistory: [
          { date: '2025-01-01', amount: 5000, reason: 'workout_volume' },
          { date: '2025-01-01', amount: 50, reason: 'workout_complete' },
        ],
      });
      expect(useGamificationStore.getState().getTotalVolume()).toBe(5000);
    });
  });

  describe('celebratePr', () => {
    it('adds PR celebration and awards XP', () => {
      const beforeXp = useGamificationStore.getState().xp;
      useGamificationStore.getState().celebratePr('Bench Press');
      expect(useGamificationStore.getState().xp).toBeGreaterThan(beforeXp);
      expect(useGamificationStore.getState().prCelebrations).toHaveLength(1);
      expect(useGamificationStore.getState().prCelebrations[0]).toContain('Bench Press');
    });
  });

  describe('recordLogin', () => {
    it('awards XP on first login of the day', () => {
      const beforeXp = useGamificationStore.getState().xp;
      const result = useGamificationStore.getState().recordLogin();
      expect(result).not.toBeNull();
      expect(useGamificationStore.getState().xp).toBeGreaterThan(beforeXp);
    });

    it('does not award XP twice on same day', () => {
      useGamificationStore.getState().recordLogin();
      const result = useGamificationStore.getState().recordLogin();
      expect(result).toBeNull();
    });
  });
});

describe('checkAchievements', () => {
  it('unlocks first_workout after first workout', () => {
    const today = new Date().toISOString().slice(0, 10);
    useGamificationStore.setState({
      xpHistory: [{ date: today, amount: 50, reason: 'workout_complete' }],
    });
    const unlocked = useGamificationStore.getState().checkAchievements();
    const firstWorkout = unlocked.find((a) => a.id === 'first_workout');
    expect(firstWorkout).toBeDefined();
  });

  it('does not re-unlock already earned achievements', () => {
    const today = new Date().toISOString().slice(0, 10);
    useGamificationStore.setState({
      xpHistory: [{ date: today, amount: 50, reason: 'workout_complete' }],
    });
    useGamificationStore.getState().checkAchievements();
    const unlockedAgain = useGamificationStore.getState().checkAchievements();
    expect(unlockedAgain).toHaveLength(0);
  });
});

describe('getLevel function', () => {
  it('matches store getLevel output', () => {
    const storeLevel = useGamificationStore.getState().getLevel();
    const directLevel = getLevel(useGamificationStore.getState().xp);
    expect(storeLevel).toEqual(directLevel);
  });
});
