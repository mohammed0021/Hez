import type { ArchivedSession } from '@/stores/workout-history-store';
import { MUSCLE_GROUP_MAP } from '@/types/exercise';

export interface ExerciseSnapshot {
  date: string;
  maxWeight: number;
  totalVolume: number;
  totalReps: number;
  avgRpe: number | null;
  setsCompleted: number;
  totalSets: number;
  allSetsCompleted: boolean;
  allTargetRepsAchieved: boolean;
  maxRpe: number | null;
}

export interface ExerciseAnalysis {
  exerciseName: string;
  muscleGroups: string[];
  sessions: ExerciseSnapshot[];
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  plateauDetected: boolean;
  plateauSessions: number;
  recommendation: OverloadRecommendation;
}

export type OverloadRecommendation =
  | { type: 'increase_weight'; suggestedWeight: number; reason: string }
  | { type: 'increase_reps'; suggestedReps: number; reason: string }
  | { type: 'maintain'; reason: string }
  | { type: 'deload'; reason: string }
  | { type: 'insufficient_data'; reason: string };

export interface MuscleVolumeData {
  muscleGroup: string;
  region: string;
  weeklyVolumes: { week: string; volume: number }[];
  totalVolume: number;
  currentWeekVolume: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MonthlyTrend {
  exerciseName: string;
  month: string;
  avgMaxWeight: number;
  avgVolume: number;
  sessions: number;
}

export interface NextSessionSuggestion {
  exerciseName: string;
  muscleGroups: string[];
  suggestedWeight: number;
  suggestedReps: number;
  suggestedRpe: number | null;
  notes: string;
}

export interface OverloadEngineOutput {
  exercises: ExerciseAnalysis[];
  muscleVolumes: MuscleVolumeData[];
  monthlyTrends: MonthlyTrend[];
  nextSession: NextSessionSuggestion[];
  plateaus: ExerciseAnalysis[];
  totalSessions: number;
  totalVolume: number;
  weeklyVolumeHistory: { week: string; volume: number }[];
}

function getWeekKey(dateStr: string): string {
  const d = new Date(dateStr);
  const start = new Date(d);
  start.setDate(start.getDate() - start.getDay());
  return start.toISOString().slice(0, 10);
}

function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7);
}

function extractExerciseSnapshots(sessions: ArchivedSession[]): Map<string, ExerciseSnapshot[]> {
  const map = new Map<string, ExerciseSnapshot[]>();

  for (const session of sessions) {
    for (const block of session.blocks) {
      for (const ex of block.exercises) {
        if (ex.sets.length === 0) continue;

        let maxWeight = 0;
        let totalVolume = 0;
        let totalReps = 0;
        let rpeSum = 0;
        let rpeCount = 0;
        let setsCompleted = 0;
        let allTargetRepsAchieved = true;

        for (const s of ex.sets) {
          if (!s.completed) {
            allTargetRepsAchieved = false;
            continue;
          }
          setsCompleted++;
          const w = s.actualWeightKg || s.targetWeightKg;
          const r = s.actualReps || s.targetReps;
          if (w > maxWeight) maxWeight = w;
          totalVolume += w * r;
          totalReps += r;
          if (s.rpe != null) {
            rpeSum += s.rpe;
            rpeCount++;
          }
          if (r < s.targetReps) allTargetRepsAchieved = false;
        }

        const existing = map.get(ex.exerciseName) || [];
        existing.push({
          date: session.completedAt,
          maxWeight,
          totalVolume,
          totalReps,
          avgRpe: rpeCount > 0 ? rpeSum / rpeCount : null,
          setsCompleted,
          totalSets: ex.sets.length,
          allSetsCompleted: setsCompleted === ex.sets.length,
          allTargetRepsAchieved,
          maxRpe:
            rpeCount > 0
              ? Math.max(...ex.sets.filter((s) => s.completed && s.rpe != null).map((s) => s.rpe!))
              : null,
        });
        map.set(ex.exerciseName, existing);
      }
    }
  }

  for (const [, snapshots] of map) {
    snapshots.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  return map;
}

function detectTrend(values: number[]): { trend: 'up' | 'down' | 'stable'; percentage: number } {
  if (values.length < 2) return { trend: 'stable', percentage: 0 };
  const recent = values.slice(-4);
  const first = recent[0] || 0;
  const last = recent[recent.length - 1] || 0;
  if (first === 0) return { trend: 'stable', percentage: 0 };
  const change = ((last - first) / first) * 100;
  if (change > 3) return { trend: 'up', percentage: Math.round(change) };
  if (change < -3) return { trend: 'down', percentage: Math.round(change) };
  return { trend: 'stable', percentage: 0 };
}

function generateRecommendation(sessions: ExerciseSnapshot[]): OverloadRecommendation {
  if (sessions.length < 2) {
    return { type: 'insufficient_data', reason: 'Need at least 2 sessions to analyze' };
  }

  const last = sessions[sessions.length - 1];
  const prev = sessions[sessions.length - 2];

  if (!last || !prev) {
    return { type: 'insufficient_data', reason: 'Need at least 2 sessions to analyze' };
  }

  // Check for deload condition: decline over 4+ sessions
  const recent = sessions.slice(-4);
  if (recent.length >= 4) {
    const weights = recent.map((s) => s.maxWeight);
    const firstW = weights[0] || 0;
    const lastW = weights[weights.length - 1] || 0;
    if (
      firstW > 0 &&
      lastW < firstW &&
      recent.every((s, i) => i === 0 || s.maxWeight <= (recent[i - 1]?.maxWeight || 0))
    ) {
      return {
        type: 'deload',
        reason: 'Weight has declined for 4+ consecutive sessions. Take a deload week to recover.',
      };
    }
  }

  // Check for decline over 2-3 sessions -> maintain
  if (recent.length >= 3) {
    const lastThree = recent.slice(-3);
    const declining = lastThree.every(
      (s, i) => i === 0 || s.maxWeight <= (lastThree[i - 1]?.maxWeight || 0),
    );
    if (declining && last.maxWeight < (lastThree[0]?.maxWeight || 0)) {
      return {
        type: 'maintain',
        reason: 'Performance declining over last 3 sessions. Maintain current weight.',
      };
    }
  }

  // Check for weight increase condition
  if (
    last.allSetsCompleted &&
    last.allTargetRepsAchieved &&
    last.maxRpe != null &&
    last.maxRpe <= 8
  ) {
    const suggestedWeight = Math.round((last.maxWeight * 1.025) / 2.5) * 2.5;
    return {
      type: 'increase_weight',
      suggestedWeight,
      reason: `All reps achieved at RPE ${last.maxRpe} (≤8). Increase weight to ${suggestedWeight}kg.`,
    };
  }

  // Check for rep progression
  if (
    last.allSetsCompleted &&
    last.totalReps > (prev.totalReps || 0) &&
    last.maxRpe != null &&
    last.maxRpe <= 8
  ) {
    const suggestedReps = Math.min(last.totalReps + 1, 15);
    return {
      type: 'increase_reps',
      suggestedReps,
      reason: `Exceeding previous rep count with RPE ≤8. Try ${suggestedReps} reps next session.`,
    };
  }

  return {
    type: 'maintain',
    reason: 'Performance is stable. Continue with current weight and reps.',
  };
}

function computeMuscleVolume(sessions: ArchivedSession[]): MuscleVolumeData[] {
  const volumeByMuscle = new Map<string, Map<string, number>>();
  const muscleRegions = new Map<string, string>();

  for (const session of sessions) {
    const week = getWeekKey(session.completedAt);
    for (const block of session.blocks) {
      for (const ex of block.exercises) {
        for (const mg of ex.muscleGroups) {
          const region = MUSCLE_GROUP_MAP[mg]?.region || 'other';
          muscleRegions.set(mg, region);

          if (!volumeByMuscle.has(mg)) volumeByMuscle.set(mg, new Map());
          const weekMap = volumeByMuscle.get(mg)!;

          let volume = 0;
          for (const s of ex.sets) {
            if (s.completed)
              volume += (s.actualWeightKg || s.targetWeightKg) * (s.actualReps || s.targetReps);
          }

          weekMap.set(week, (weekMap.get(week) || 0) + volume);
        }
      }
    }
  }

  const weeks = new Set<string>();
  for (const weekMap of volumeByMuscle.values()) {
    for (const w of weekMap.keys()) weeks.add(w);
  }
  const sortedWeeks = Array.from(weeks).sort();

  const result: MuscleVolumeData[] = [];
  for (const [mg, weekMap] of volumeByMuscle) {
    const weeklyVolumes = sortedWeeks.map((w) => ({
      week: w,
      volume: weekMap.get(w) || 0,
    }));
    const totalVolume = Array.from(weekMap.values()).reduce((s, v) => s + v, 0);
    const currentWeek = sortedWeeks[sortedWeeks.length - 1] || '';
    const prevWeek = sortedWeeks[sortedWeeks.length - 2] || '';
    const currentWeekVolume = weekMap.get(currentWeek) || 0;
    const prevWeekVolume = weekMap.get(prevWeek) || 0;
    const trend: 'up' | 'down' | 'stable' =
      prevWeekVolume > 0
        ? currentWeekVolume > prevWeekVolume * 1.05
          ? 'up'
          : currentWeekVolume < prevWeekVolume * 0.95
            ? 'down'
            : 'stable'
        : 'stable';
    result.push({
      muscleGroup: mg,
      region: muscleRegions.get(mg) || 'other',
      weeklyVolumes,
      totalVolume,
      currentWeekVolume,
      trend,
    });
  }
  result.sort((a, b) => b.totalVolume - a.totalVolume);
  return result;
}

function computeMonthlyTrends(sessions: ArchivedSession[]): MonthlyTrend[] {
  const byExerciseAndMonth = new Map<
    string,
    Map<string, { weights: number[]; volumes: number[]; count: number }>
  >();

  for (const session of sessions) {
    const month = getMonthKey(session.completedAt);
    for (const block of session.blocks) {
      for (const ex of block.exercises) {
        if (ex.sets.length === 0) continue;
        let maxWeight = 0;
        let totalVolume = 0;
        for (const s of ex.sets) {
          if (!s.completed) continue;
          const w = s.actualWeightKg || s.targetWeightKg;
          const r = s.actualReps || s.targetReps;
          if (w > maxWeight) maxWeight = w;
          totalVolume += w * r;
        }

        if (!byExerciseAndMonth.has(ex.exerciseName))
          byExerciseAndMonth.set(ex.exerciseName, new Map());
        const monthMap = byExerciseAndMonth.get(ex.exerciseName)!;
        if (!monthMap.has(month)) monthMap.set(month, { weights: [], volumes: [], count: 0 });
        const entry = monthMap.get(month)!;
        entry.weights.push(maxWeight);
        entry.volumes.push(totalVolume);
        entry.count++;
      }
    }
  }

  const result: MonthlyTrend[] = [];
  for (const [exerciseName, monthMap] of byExerciseAndMonth) {
    for (const [month, data] of monthMap) {
      const avgMaxWeight = data.weights.reduce((s, v) => s + v, 0) / data.weights.length;
      const avgVolume = data.volumes.reduce((s, v) => s + v, 0) / data.volumes.length;
      result.push({
        exerciseName,
        month,
        avgMaxWeight: Math.round(avgMaxWeight * 10) / 10,
        avgVolume: Math.round(avgVolume),
        sessions: data.count,
      });
    }
  }
  result.sort(
    (a, b) => a.month.localeCompare(b.month) || a.exerciseName.localeCompare(b.exerciseName),
  );
  return result;
}

function computeWeeklyVolumeHistory(
  sessions: ArchivedSession[],
): { week: string; volume: number }[] {
  const byWeek = new Map<string, number>();
  for (const session of sessions) {
    const week = getWeekKey(session.completedAt);
    byWeek.set(week, (byWeek.get(week) || 0) + session.volume);
  }
  return Array.from(byWeek.entries())
    .map(([week, volume]) => ({ week, volume }))
    .sort((a, b) => a.week.localeCompare(b.week));
}

function generateNextSessionSuggestions(exercises: ExerciseAnalysis[]): NextSessionSuggestion[] {
  return exercises
    .filter((ex) => ex.sessions.length >= 2)
    .map((ex) => {
      const rec = ex.recommendation;
      const last = ex.sessions[ex.sessions.length - 1];
      const weight = rec.type === 'increase_weight' ? rec.suggestedWeight : last?.maxWeight || 0;
      const reps =
        rec.type === 'increase_reps'
          ? rec.suggestedReps
          : last
            ? Math.round(last.totalReps / Math.max(1, last.setsCompleted))
            : 10;

      let notes = rec.reason;
      if (ex.plateauDetected) {
        notes += ' Plateau detected — consider varying rep scheme or exercise variation.';
      }

      return {
        exerciseName: ex.exerciseName,
        muscleGroups: ex.muscleGroups,
        suggestedWeight: weight,
        suggestedReps: reps,
        suggestedRpe: rec.type === 'increase_weight' ? 8 : null,
        notes,
      };
    });
}

export function analyzeProgressiveOverload(sessions: ArchivedSession[]): OverloadEngineOutput {
  const snapshots = extractExerciseSnapshots(sessions);

  const exercises: ExerciseAnalysis[] = [];
  const plateaus: ExerciseAnalysis[] = [];

  for (const [name, exSessions] of snapshots) {
    const weights = exSessions.map((s) => s.maxWeight);
    const { trend, percentage } = detectTrend(weights);

    // Plateau detection: 4+ sessions without any weight/reps progress
    const recentSessions = exSessions.slice(-4);
    const plateauDetected =
      recentSessions.length >= 4 &&
      recentSessions.every(
        (s, i) =>
          i === 0 ||
          (s.maxWeight <= (recentSessions[i - 1]?.maxWeight || 0) &&
            s.totalReps <= (recentSessions[i - 1]?.totalReps || 0)),
      );

    const recommendation = generateRecommendation(exSessions);

    const ex: ExerciseAnalysis = {
      exerciseName: name,
      muscleGroups: [],
      sessions: exSessions,
      trend,
      trendPercentage: percentage,
      plateauDetected,
      plateauSessions: plateauDetected ? recentSessions.length : 0,
      recommendation,
    };

    // Get muscle groups from latest session data
    for (const session of sessions) {
      for (const block of session.blocks) {
        for (const blockEx of block.exercises) {
          if (blockEx.exerciseName === name) {
            ex.muscleGroups = [...blockEx.muscleGroups];
            break;
          }
        }
      }
    }

    exercises.push(ex);
    if (plateauDetected) plateaus.push(ex);
  }

  exercises.sort((a, b) => b.sessions.length - a.sessions.length);

  const muscleVolumes = computeMuscleVolume(sessions);
  const monthlyTrends = computeMonthlyTrends(sessions);
  const weeklyVolumeHistory = computeWeeklyVolumeHistory(sessions);
  const totalVolume = sessions.reduce((s, sess) => s + sess.volume, 0);
  const nextSession = generateNextSessionSuggestions(exercises);

  return {
    exercises,
    muscleVolumes,
    monthlyTrends,
    nextSession,
    plateaus,
    totalSessions: sessions.length,
    totalVolume,
    weeklyVolumeHistory,
  };
}
