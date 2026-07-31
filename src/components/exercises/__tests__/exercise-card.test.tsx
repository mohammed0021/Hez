import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExerciseCard } from '@/components/exercises/exercise-card';
import { useExerciseStore } from '@/stores/exercise-store';
import type { Exercise } from '@/types/exercise';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const React = require('react');
      return React.createElement('div', { ...props }, children);
    },
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => {
    const React = require('react');
    return React.createElement('a', { href, ...props }, children);
  },
}));

const mockExercise: Exercise = {
  id: 'bench-press',
  name: 'Bench Press',
  description: 'A compound upper body exercise',
  muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
  primaryMuscleGroups: ['Chest', 'Shoulders'],
  secondaryMuscleGroups: ['Triceps'],
  equipment: ['Barbell', 'Bench'],
  difficulty: 'intermediate',
  exerciseType: 'strength',
  instructions: ['Lie on bench', 'Press bar up'],
  trainingTips: ['Keep elbows at 45 degrees'],
  commonMistakes: ['Bouncing the bar'],
  category: 'strength',
  movementPattern: 'push',
  mechanics: 'compound',
  grip: 'pronated',
  primeMovers: ['Chest'],
  videoUrl: null,
  imageUrl: null,
  thumbnailUrl: null,
  alternativeIds: [],
};

beforeEach(() => {
  useExerciseStore.setState({
    favorites: [],
    recentlyUsed: [],
    searchQuery: '',
    activeFilters: { equipment: [], muscleGroups: [], difficulties: [] },
    selectedCategory: null,
    viewMode: 'grid',
  });
});

describe('ExerciseCard', () => {
  it('renders exercise name', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    expect(screen.getAllByText('Bench Press').length).toBeGreaterThan(0);
  });

  it('renders description', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    expect(screen.getByText(/A compound upper/)).toBeInTheDocument();
  });

  it('renders muscle group badges', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.getByText('Shoulders')).toBeInTheDocument();
  });

  it('renders difficulty label', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  it('links to exercise detail page', () => {
    render(<ExerciseCard exercise={mockExercise} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/exercises/bench-press');
  });

  it('toggles favorite on heart click', async () => {
    const user = userEvent.setup();
    render(<ExerciseCard exercise={mockExercise} />);
    const heartBtn = screen.getByRole('button');
    await user.click(heartBtn);
    expect(useExerciseStore.getState().favorites).toContain('bench-press');
  });

  it('shows filled heart when favorited', () => {
    useExerciseStore.setState({ favorites: ['bench-press'] });
    render(<ExerciseCard exercise={mockExercise} />);
    const heart = screen.getByRole('button').querySelector('svg');
    expect(heart).toBeTruthy();
  });
});
