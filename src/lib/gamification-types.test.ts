import { describe, it, expect } from 'vitest';
import { xpForLevel, getLevel, ACHIEVEMENTS, CHALLENGES, XP_REWARDS } from './gamification-types';

describe('xpForLevel', () => {
  it('returns correct XP for level 1', () => {
    expect(xpForLevel(1)).toBe(100);
  });

  it('returns correct XP for level 5', () => {
    expect(xpForLevel(5)).toBe(1500);
  });

  it('returns correct XP for level 10', () => {
    expect(xpForLevel(10)).toBe(5500);
  });

  it('returns 0 for level 0', () => {
    expect(xpForLevel(0)).toBe(0);
  });
});

describe('getLevel', () => {
  it('returns level 1 for 0 XP', () => {
    const result = getLevel(0);
    expect(result.level).toBe(1);
    expect(result.currentXp).toBe(0);
    expect(result.nextXp).toBe(100);
  });

  it('returns level 2 at exactly 100 XP', () => {
    const result = getLevel(100);
    expect(result.level).toBe(2);
  });

  it('returns correct progress at 50 XP', () => {
    const result = getLevel(50);
    expect(result.level).toBe(1);
    expect(result.progress).toBe(0.5);
  });

  it('returns level 5 at 1200 XP', () => {
    const result = getLevel(1200);
    expect(result.level).toBe(5);
  });
});

describe('ACHIEVEMENTS', () => {
  it('has 24 achievements', () => {
    expect(ACHIEVEMENTS).toHaveLength(24);
  });

  it('every achievement has required fields', () => {
    for (const ach of ACHIEVEMENTS) {
      expect(ach.id).toBeTruthy();
      expect(ach.title).toBeTruthy();
      expect(ach.description).toBeTruthy();
      expect(ach.icon).toBeTruthy();
      expect(ach.xpReward).toBeGreaterThan(0);
    }
  });

  it('has unique IDs', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('CHALLENGES', () => {
  it('has 14 challenges', () => {
    expect(CHALLENGES).toHaveLength(14);
  });

  it('has 5 daily, 5 weekly, 4 monthly challenges', () => {
    expect(CHALLENGES.filter((c) => c.frequency === 'daily')).toHaveLength(5);
    expect(CHALLENGES.filter((c) => c.frequency === 'weekly')).toHaveLength(5);
    expect(CHALLENGES.filter((c) => c.frequency === 'monthly')).toHaveLength(4);
  });

  it('every challenge has required fields', () => {
    for (const c of CHALLENGES) {
      expect(c.id).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.frequency).toMatch(/^(daily|weekly|monthly)$/);
      expect(c.target).toBeGreaterThan(0);
      expect(c.xpReward).toBeGreaterThan(0);
    }
  });

  it('has unique IDs', () => {
    const ids = CHALLENGES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('XP_REWARDS', () => {
  it('all rewards are positive', () => {
    for (const value of Object.values(XP_REWARDS)) {
      expect(value).toBeGreaterThan(0);
    }
  });

  it('workout completion gives 50 XP', () => {
    expect(XP_REWARDS.workout_complete).toBe(50);
  });
});
