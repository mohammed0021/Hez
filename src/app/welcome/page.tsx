'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Check, ChevronRight, Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { useLocaleStore } from '@/stores/locale-store';
import { locales, localeNames, getDirection } from '@/i18n/locales';
import { THEMES } from '@/lib/constants';
import type { ThemeId, ThemeMode } from '@/types/theme';

type Step = 'language' | 'theme' | 'mode' | 'done';

const STEP_ORDER: Step[] = ['language', 'theme', 'mode'];

export default function WelcomePage() {
  const t = useTranslations('welcome');
  const tc = useTranslations('common');
  const ts = useTranslations('settings');
  const router = useRouter();
  const { setThemeId, setMode, mode, themeId } = useThemeStore();
  const { setLocale, locale } = useLocaleStore();

  const [step, setStep] = useState<Step>('language');
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [selectedTheme, setSelectedTheme] = useState(themeId);
  const [selectedMode, setSelectedMode] = useState<ThemeMode>(mode);

  const stepIndex = STEP_ORDER.indexOf(step);
  const totalSteps = STEP_ORDER.length;

  const handleNext = () => {
    const cur = STEP_ORDER.indexOf(step);
    if (cur < totalSteps - 1) {
      setStep(STEP_ORDER[cur + 1]!);
    } else {
      setLocale(selectedLocale as typeof locale);
      setThemeId(selectedTheme);
      setMode(selectedMode);
      if (typeof window !== 'undefined') {
        const dir = getDirection(selectedLocale);
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', selectedLocale);
      }
      router.replace('/');
    }
  };

  const handleSkip = () => {
    setLocale(selectedLocale as typeof locale);
    setThemeId(selectedTheme);
    setMode(selectedMode);
    if (typeof window !== 'undefined') {
      const dir = getDirection(selectedLocale);
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', selectedLocale);
    }
    router.replace('/');
  };

  return (
    <div className="min-h-screen-safe bg-background flex flex-col px-4 pt-4 pb-24">
      <div className="flex items-center justify-between pt-6">
        <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl text-sm font-bold">
          H
        </div>
        <button
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
        >
          {tc('skip')}
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center">
        <div className="mb-10 flex gap-1.5">
          {STEP_ORDER.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= stepIndex ? 'bg-primary w-8' : 'bg-muted w-1.5'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'language' && (
            <motion.div
              key="language"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="w-full"
            >
              <h1 className="text-foreground text-center text-2xl font-bold">{t('title')}</h1>
              <p className="text-muted-foreground mt-1 text-center text-sm">{t('subtitle')}</p>

              <div className="mt-8 space-y-2">
                {locales.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLocale(l)}
                    className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                      selectedLocale === l
                        ? 'border-primary bg-primary/[0.06]'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <span className="text-foreground text-base font-medium">{localeNames[l]}</span>
                    {selectedLocale === l && (
                      <div className="bg-primary flex size-6 items-center justify-center rounded-full">
                        <Check size={14} className="text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'theme' && (
            <motion.div
              key="theme"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="w-full"
            >
              <h1 className="text-foreground text-center text-2xl font-bold">
                {t('choose_accent')}
              </h1>
              <p className="text-muted-foreground mt-1 text-center text-sm">{t('theme_hint')}</p>

              <div className="mt-8 grid grid-cols-4 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id as ThemeId)}
                    className={`relative flex aspect-square items-center justify-center rounded-2xl transition-all ${
                      selectedTheme === t.id
                        ? 'ring-primary ring-offset-background scale-105 ring-2 ring-offset-2'
                        : ''
                    }`}
                    style={{ backgroundColor: t.color }}
                    title={t.label}
                  >
                    {selectedTheme === t.id && (
                      <Check size={18} className="text-white drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-muted-foreground/60 mt-3 text-center text-xs">
                {THEMES.find((t) => t.id === selectedTheme)?.label}
              </p>
            </motion.div>
          )}

          {step === 'mode' && (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="w-full"
            >
              <h1 className="text-foreground text-center text-2xl font-bold">{t('mode_title')}</h1>
              <p className="text-muted-foreground mt-1 text-center text-sm">{t('mode_hint')}</p>

              <div className="mt-8 space-y-3">
                {[
                  {
                    value: 'light',
                    icon: Sun,
                    label: ts('light'),
                    desc: t('mode_light_desc'),
                  },
                  { value: 'dark', icon: Moon, label: ts('dark'), desc: t('mode_dark_desc') },
                  {
                    value: 'system',
                    icon: Monitor,
                    label: ts('system'),
                    desc: t('mode_system_desc'),
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  const isActive = selectedMode === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedMode(opt.value as ThemeMode)}
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                        isActive
                          ? 'border-primary bg-primary/[0.06]'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <div
                        className={`flex size-10 items-center justify-center rounded-xl ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-base font-medium">{opt.label}</p>
                        <p className="text-muted-foreground/60 text-xs">{opt.desc}</p>
                      </div>
                      {isActive && (
                        <div className="bg-primary flex size-6 items-center justify-center rounded-full">
                          <Check size={14} className="text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-4 pb-8">
        <button
          onClick={handleNext}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-semibold transition-colors"
        >
          {step === 'mode' ? t('start') : tc('continue')}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
