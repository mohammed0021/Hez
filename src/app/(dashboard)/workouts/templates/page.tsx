'use client';

import { motion } from 'framer-motion';
import { Bookmark, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useWorkoutStore } from '@/stores/workout-store';
import { starterTemplates } from '@/data/workout-templates';
import { TemplateCard } from '@/components/workouts/template-card';

export default function TemplatesPage() {
  const userTemplates = useWorkoutStore((s) => s.templates);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <Link href="/workouts" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Template Library</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {starterTemplates.length + userTemplates.length} templates
          </p>
        </div>
      </motion.div>

      {/* Starter templates */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
          <Bookmark size={16} className="text-primary" />
          Starter Templates
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {starterTemplates.map((t, i) => (
            <TemplateCard key={t.id} template={t} index={i} />
          ))}
        </div>
      </section>

      {/* User-created templates */}
      {userTemplates.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-foreground">Your Templates</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {userTemplates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </section>
      )}

      {starterTemplates.length === 0 && userTemplates.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card p-12">
          <Bookmark size={40} className="text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No templates yet</p>
          <Link
            href="/workouts/new"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
          >
            Create your first template
          </Link>
        </div>
      )}
    </div>
  );
}
