import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AchievementCard } from '@/components/gamification/achievement-card';
import type { AchievementDef } from '@/lib/gamification-types';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const React = require('react');
      return React.createElement('div', { ...props }, children);
    },
  },
}));

const mockDef: AchievementDef = {
  id: 'first_workout',
  title: 'First Step',
  description: 'Complete your first workout',
  icon: 'Dumbbell',
  xpReward: 100,
};

describe('AchievementCard', () => {
  it('renders achievement title', () => {
    render(<AchievementCard def={mockDef} index={0} />);
    expect(screen.getByText('First Step')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<AchievementCard def={mockDef} index={0} />);
    expect(screen.getByText('Complete your first workout')).toBeInTheDocument();
  });

  it('shows locked state with XP reward', () => {
    render(<AchievementCard def={mockDef} index={0} />);
    expect(screen.getByText('+100 XP')).toBeInTheDocument();
  });

  it('shows unlocked state with date', () => {
    const unlocked = {
      id: 'first_workout',
      unlockedAt: '2025-06-15T10:00:00Z',
    };
    render(<AchievementCard def={mockDef} unlocked={unlocked} index={0} />);
    expect(screen.getByText(/Unlocked/)).toBeInTheDocument();
    expect(screen.queryByText('+100 XP')).not.toBeInTheDocument();
  });
});
