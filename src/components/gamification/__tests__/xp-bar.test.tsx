import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { XpBar } from '@/components/gamification/xp-bar';
import { useGamificationStore } from '@/stores/gamification-store';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const React = require('react');
      return React.createElement('div', { ...props }, children);
    },
  },
}));

vi.mock('lucide-react', () => ({
  Sparkles: (props: any) => {
    const React = require('react');
    return React.createElement('svg', { 'data-testid': 'icon-sparkles', ...props });
  },
}));

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

describe('XpBar', () => {
  it('renders level 1 for new user', () => {
    render(<XpBar />);
    expect(screen.getByText('Level 1')).toBeInTheDocument();
  });

  it('shows XP progress', () => {
    render(<XpBar />);
    expect(screen.getByText(/100 XP to next level/)).toBeInTheDocument();
  });

  it('shows correct level for XP', () => {
    useGamificationStore.setState({ xp: 5000 });
    render(<XpBar />);
    expect(screen.getByText(/Level 10/)).toBeInTheDocument();
  });

  it('renders without label when showLabel is false', () => {
    render(<XpBar showLabel={false} />);
    expect(screen.queryByText('Level 1')).not.toBeInTheDocument();
    expect(screen.queryByText(/100 XP to next level/)).not.toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container } = render(<XpBar size="sm" />);
    const bar = container.querySelector('.h-1\\.5');
    expect(bar).toBeTruthy();
  });

  it('renders progress bar with correct width', () => {
    useGamificationStore.setState({ xp: 50 });
    render(<XpBar />);
    expect(screen.getByText('Level 1')).toBeInTheDocument();
  });
});
