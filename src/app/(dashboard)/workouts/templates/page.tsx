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
          <h1 className="text-foreground text-2xl font-bold">Template Library</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {starterTemplates.length + userTemplates.length} templates
          </p>
        </div>
      </motion.div>

      {/* Starter templates */}
      <section>
        <h2 className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
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
          <h2 className="text-foreground mb-3 text-sm font-semibold">Your Templates</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {userTemplates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        </section>
      )}

      {starterTemplates.length === 0 && userTemplates.length === 0 && (
        <div className="border-border/50 bg-card flex flex-col items-center gap-3 rounded-2xl border p-4">
          <Bookmark size={40} className="text-muted-foreground/30" />
          <p className="text-muted-foreground text-sm">No templates yet</p>
          <Link
            href="/workouts/new"
            className="bg-primary text-primary-foreground min-h-[44px] rounded-xl px-4 py-2 text-xs font-medium"
          >
            Create your first template
          </Link>
        </div>
      )}
    </div>
  );
}
