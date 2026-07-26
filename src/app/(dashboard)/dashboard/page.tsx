'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TodaysWorkout } from '@/components/dashboard/todays-workout';
import { StreakWidget } from '@/components/dashboard/streak-widget';
import { WeightWidget } from '@/components/dashboard/weight-widget';
import { CaloriesWidget } from '@/components/dashboard/calories-widget';
import { ProteinWidget } from '@/components/dashboard/protein-widget';
import { WaterWidget } from '@/components/dashboard/water-widget';
import { SupplementWidget } from '@/components/dashboard/supplement-widget';
import { WeeklyChartWidget } from '@/components/dashboard/weekly-chart-widget';
import { MonthlyChartWidget } from '@/components/dashboard/monthly-chart-widget';
import { PersonalRecordsWidget } from '@/components/dashboard/personal-records-widget';
import { UpcomingWorkoutWidget } from '@/components/dashboard/upcoming-workout-widget';
import { RecentActivityWidget } from '@/components/dashboard/recent-activity-widget';
import { AchievementWidget } from '@/components/dashboard/achievement-widget';
import { QuickActionsWidget } from '@/components/dashboard/quick-actions-widget';

export default function DashboardPage() {
  const [dateStr, setDateStr] = useState('');
  useEffect(() => {
    setDateStr(new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {dateStr || <span className="inline-block w-48 h-4 rounded bg-muted animate-pulse" />}
          </p>
        </div>
      </motion.div>

      <div className="space-y-4">
        {/* Row 1: Today's Workout (full width) */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }}>
          <TodaysWorkout />
        </motion.div>

        {/* Row 2: Streak + Calories + Water */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
            <StreakWidget />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}>
            <CaloriesWidget />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <WaterWidget />
          </motion.div>
        </div>

        {/* Row 3: Protein + Weight + Supplements */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <ProteinWidget />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <WeightWidget />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
            <SupplementWidget />
          </motion.div>
        </div>

        {/* Row 4: Charts side by side */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <WeeklyChartWidget />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <MonthlyChartWidget />
          </motion.div>
        </div>

        {/* Row 5: Upcoming + Records */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <UpcomingWorkoutWidget />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <PersonalRecordsWidget />
          </motion.div>
        </div>

        {/* Row 6: Activity + Achievements + Quick Actions */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
            <RecentActivityWidget />
          </motion.div>
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
            <AchievementWidget />
          </motion.div>
          <motion.div className="lg:col-span-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
            <QuickActionsWidget />
          </motion.div>
        </div>
      </div>
    </>
  );
}
