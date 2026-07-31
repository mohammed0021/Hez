'use client';

import { motion } from 'framer-motion';
import { Scale, Trophy, TrendingUp, ChevronRight, BrainCircuit, Weight, Ruler } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function ProgressHubPage() {
  const t = useTranslations();

  const cards = [
    {
      icon: Weight,
      label: t('progress.weight'),
      desc: t('progress.weight_subtitle'),
      href: '/progress/weight',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: Scale,
      label: t('progress.bmi'),
      desc: t('progress.bmi_subtitle'),
      href: '/progress/bmi',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      icon: Ruler,
      label: t('progress.measurements'),
      desc: t('progress.measurements_subtitle'),
      href: '/progress/measurements',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      icon: BrainCircuit,
      label: t('progress.analytics'),
      desc: t('progress.analytics_heatmap_desc'),
      href: '/progress/analytics',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Trophy,
      label: t('progress.records'),
      desc: t('progress.records_subtitle'),
      href: '/progress/records',
      color: 'bg-amber-500/10 text-amber-500',
    },
    {
      icon: TrendingUp,
      label: t('progress.strength_trends'),
      desc: t('progress.strength_subtitle'),
      href: '/progress/strength',
      color: 'bg-rose-500/10 text-rose-500',
    },
  ];
  return (
    <>
      <div>
        <h1 className="text-foreground text-2xl font-bold">{t('progress.title')}</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">{t('progress.subtitle')}</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={card.href}
                className="bg-card border-border/50 hover:border-primary/30 flex items-center gap-4 rounded-2xl border p-4 transition-colors"
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${card.color}`}
                >
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-semibold">{card.label}</p>
                  <p className="text-muted-foreground mt-0.5 text-[10px]">{card.desc}</p>
                </div>
                <ChevronRight className="text-muted-foreground size-4 shrink-0" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
