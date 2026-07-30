'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Globe,
  Ruler,
  Dumbbell,
  Bell,
  Shield,
  Download,
  Trash2,
  HelpCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Moon,
  Sun,
  Monitor,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { useLocaleStore } from '@/stores/locale-store';
import type { ThemeId, ThemeMode } from '@/types/theme';
import type { Locale } from '@/i18n/locales';
import { THEMES, LANGUAGES } from '@/lib/constants';
import { useSettingsStore, type UnitSystem, type SettingsState } from '@/stores/settings-store';
import { useProfileStore, VISIBILITY_OPTIONS, type ProfileState } from '@/stores/profile-store';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';

const APP_VERSION = '1.0.0';

type SectionId =
  | 'theme'
  | 'language'
  | 'units'
  | 'workout'
  | 'notifications'
  | 'privacy'
  | 'export'
  | 'delete'
  | 'help'
  | 'about';

const SECTIONS: {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'units', label: 'Units', icon: Ruler },
  { id: 'workout', label: 'Workout Preferences', icon: Dumbbell },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'export', label: 'Data Export', icon: Download },
  { id: 'delete', label: 'Account Deletion', icon: Trash2 },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
  { id: 'about', label: 'About Hêz', icon: Info },
];

export default function SettingsPage() {
  const router = useRouter();
  const { themeId, mode, setThemeId, setMode } = useThemeStore();
  const { setLocale } = useLocaleStore();
  const settings = useSettingsStore();
  const profile = useProfileStore();

  const [expanded, setExpanded] = useState<SectionId | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [exportDone, setExportDone] = useState(false);

  const toggle = (id: SectionId) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleExport = () => {
    const data: Record<string, unknown> = {};
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('hez-')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hez-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (deleteText.toLowerCase() !== 'delete') return;
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc('delete_user_account');
      if (error) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          await supabase.auth.admin.deleteUser(session.user.id);
        }
      }
    } catch {
      // Continue with local cleanup even if server delete fails
    }
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('hez-')) {
        localStorage.removeItem(key);
      }
    }
    profile.reset();
    settings.reset();
    useAuthStore.getState().reset();
    router.push('/auth/login');
  };

  return (
    <div className="pb-8">
      <h2 className="text-foreground text-2xl font-bold">Settings</h2>
      <p className="text-muted-foreground mt-1 text-sm">Customize your Hêz experience</p>

      <div className="mt-6 space-y-1">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOpen = expanded === section.id;

          return (
            <div key={section.id} className="border-border overflow-hidden rounded-xl border">
              <button
                onClick={() => toggle(section.id)}
                className="hover:bg-muted/50 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors"
              >
                <Icon size={16} className="text-muted-foreground" />
                <span className="text-foreground flex-1 text-sm font-medium">{section.label}</span>
                {isOpen ? (
                  <ChevronDown size={14} className="text-muted-foreground/50" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground/50" />
                )}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-border border-t px-4 py-4">
                      {section.id === 'theme' && (
                        <ThemeSection
                          themeId={themeId}
                          mode={mode}
                          setThemeId={setThemeId}
                          setMode={setMode}
                        />
                      )}
                      {section.id === 'language' && (
                        <LanguageSection
                          current={settings.language}
                          onSelect={(code) => {
                            settings.setLanguage(code);
                            setLocale(code as Locale);
                            setTimeout(() => router.refresh(), 100);
                          }}
                        />
                      )}
                      {section.id === 'units' && <UnitsSection settings={settings} />}
                      {section.id === 'workout' && <WorkoutSection settings={settings} />}
                      {section.id === 'notifications' && <NotificationsSection />}
                      {section.id === 'privacy' && <PrivacySection profile={profile} />}
                      {section.id === 'export' && (
                        <ExportSection onExport={handleExport} done={exportDone} />
                      )}
                      {section.id === 'delete' && (
                        <DeleteSection
                          showConfirm={showDeleteConfirm}
                          setShowConfirm={setShowDeleteConfirm}
                          deleteText={deleteText}
                          setDeleteText={setDeleteText}
                          onDelete={handleDeleteAccount}
                        />
                      )}
                      {section.id === 'help' && <HelpSection />}
                      {section.id === 'about' && <AboutSection />}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Theme */
function ThemeSection({
  themeId,
  mode,
  setThemeId,
  setMode,
}: {
  themeId: ThemeId;
  mode: ThemeMode;
  setThemeId: (id: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          Accent Color
        </p>
        <div className="flex flex-wrap gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setThemeId(t.id as ThemeId)}
              className={`relative flex size-10 items-center justify-center rounded-xl transition-all ${
                themeId === t.id
                  ? 'ring-primary ring-offset-background scale-110 ring-2 ring-offset-2'
                  : ''
              }`}
              style={{ backgroundColor: t.color }}
              title={t.label}
            >
              {themeId === t.id && <Check size={14} className="text-white" />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          Mode
        </p>
        <div className="flex gap-2">
          {[
            { value: 'light', icon: Sun, label: 'Light' },
            { value: 'dark', icon: Moon, label: 'Dark' },
            { value: 'system', icon: Monitor, label: 'System' },
          ].map((opt) => {
            const OptIcon = opt.icon;
            const isActive = mode === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setMode(opt.value as ThemeMode)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <OptIcon size={14} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Language */
function LanguageSection({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (code: string) => void;
}) {
  return (
    <div className="space-y-1">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onSelect(lang.code)}
          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
            current === lang.code
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-foreground hover:bg-muted'
          }`}
        >
          <span>{lang.nativeLabel}</span>
          {current === lang.code && <Check size={14} />}
        </button>
      ))}
      <p className="text-muted-foreground/60 mt-2 text-[10px]">
        Language changes apply immediately.
      </p>
    </div>
  );
}

/* Units */
const UNIT_SYSTEMS: { value: UnitSystem; label: string }[] = [
  { value: 'metric', label: 'Metric (kg, cm, ml)' },
  { value: 'imperial', label: 'Imperial (lbs, ft, oz)' },
];

function UnitsSection({ settings }: { settings: SettingsState }) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          System
        </p>
        <div className="flex gap-2">
          {UNIT_SYSTEMS.map((sys) => (
            <button
              key={sys.value}
              onClick={() => settings.setUnitSystem(sys.value)}
              className={`flex-1 rounded-xl py-2 text-xs font-medium transition-colors ${
                settings.unitSystem === sys.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {sys.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          Weight Unit
        </p>
        <div className="flex gap-2">
          {(['kg', 'lbs'] as const).map((u) => (
            <button
              key={u}
              onClick={() => settings.updateSettings({ weightUnit: u })}
              className={`flex-1 rounded-xl py-2 text-xs font-medium transition-colors ${
                settings.weightUnit === u
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          Height Unit
        </p>
        <div className="flex gap-2">
          {(['cm', 'ft_in'] as const).map((u) => (
            <button
              key={u}
              onClick={() => settings.updateSettings({ heightUnit: u })}
              className={`flex-1 rounded-xl py-2 text-xs font-medium transition-colors ${
                settings.heightUnit === u
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {u === 'cm' ? 'Centimeters' : 'Feet/Inches'}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          Water Unit
        </p>
        <div className="flex gap-2">
          {(['ml', 'oz'] as const).map((u) => (
            <button
              key={u}
              onClick={() => settings.updateSettings({ waterUnit: u })}
              className={`flex-1 rounded-xl py-2 text-xs font-medium transition-colors ${
                settings.waterUnit === u
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {u === 'ml' ? 'Milliliters' : 'Fluid Ounces'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Workout Preferences */
function WorkoutSection({ settings }: { settings: SettingsState }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          Rest Timer Default
        </p>
        <div className="flex gap-2">
          {[30, 60, 90, 120, 180].map((sec) => (
            <button
              key={sec}
              onClick={() => settings.updateSettings({ defaultRestTimer: sec })}
              className={`flex-1 rounded-xl py-2 text-xs font-medium transition-colors ${
                settings.defaultRestTimer === sec
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {sec < 60 ? `${sec}s` : `${sec / 60}m`}
            </button>
          ))}
        </div>
      </div>
      <ToggleRow
        label="Auto-start Rest Timer"
        description="Start rest timer automatically after completing a set"
        enabled={settings.autoStartRestTimer}
        onChange={(v) => settings.updateSettings({ autoStartRestTimer: v })}
      />
      <ToggleRow
        label="Sound Effects"
        description="Play sounds for timer, completion, and alerts"
        enabled={settings.soundEnabled}
        onChange={(v) => settings.updateSettings({ soundEnabled: v })}
      />
      <ToggleRow
        label="Vibration"
        description="Vibrate on timer completion and alerts"
        enabled={settings.vibrationEnabled}
        onChange={(v) => settings.updateSettings({ vibrationEnabled: v })}
      />
    </div>
  );
}

/* Notifications Link */
function NotificationsSection() {
  return (
    <Link
      href="/settings/notifications"
      className="bg-muted/50 hover:bg-muted flex items-center justify-between rounded-xl px-4 py-3 transition-colors"
    >
      <div>
        <p className="text-foreground text-sm font-medium">Notification Preferences</p>
        <p className="text-muted-foreground text-xs">Push, quiet hours, per-type toggles & more</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-primary text-xs font-medium">Open</span>
        <ExternalLink size={14} className="text-primary" />
      </div>
    </Link>
  );
}

/* Privacy */
function PrivacySection({ profile }: { profile: ProfileState }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
          Profile Visibility
        </p>
        <div className="space-y-1">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => profile.updateProfile({ profileVisibility: opt.value })}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${
                profile.profileVisibility === opt.value
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <div>
                <p className="text-sm">{opt.label}</p>
                <p className="text-muted-foreground/60 text-[10px]">{opt.description}</p>
              </div>
              {profile.profileVisibility === opt.value && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1">
        <ToggleRow
          label="Show Workout History"
          description="Display your past workouts on your profile"
          enabled={profile.showWorkoutHistory}
          onChange={(v) => profile.updateProfile({ showWorkoutHistory: v })}
        />
        <ToggleRow
          label="Show Achievements"
          description="Display unlocked achievements"
          enabled={profile.showAchievements}
          onChange={(v) => profile.updateProfile({ showAchievements: v })}
        />
        <ToggleRow
          label="Show Body Stats"
          description="Display your body measurements"
          enabled={profile.showBodyStats}
          onChange={(v) => profile.updateProfile({ showBodyStats: v })}
        />
      </div>
    </div>
  );
}

/* Data Export */
function ExportSection({ onExport, done }: { onExport: () => void; done: boolean }) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        Export all your Hêz data as a JSON file. This includes workouts, nutrition logs, body stats,
        progress photos, and all settings.
      </p>
      <button
        onClick={onExport}
        className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors ${
          done
            ? 'bg-green-500/20 text-green-600'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        <Download size={16} />
        {done ? 'Exported!' : 'Export My Data'}
      </button>
    </div>
  );
}

/* Account Deletion */
function DeleteSection({
  showConfirm,
  setShowConfirm,
  deleteText,
  setDeleteText,
  onDelete,
}: {
  showConfirm: boolean;
  setShowConfirm: (v: boolean) => void;
  deleteText: string;
  setDeleteText: (v: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="bg-destructive/10 rounded-xl p-3">
        <p className="text-destructive text-sm font-medium">Danger Zone</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Deleting your account removes all locally stored data. This action cannot be undone.
        </p>
      </div>
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-colors"
        >
          <Trash2 size={16} />
          Delete Account
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs">
            Type <span className="text-destructive font-bold">delete</span> to confirm.
          </p>
          <input
            type="text"
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder="Type 'delete' to confirm"
            className="border-destructive/50 bg-background text-foreground focus:border-destructive w-full rounded-xl border px-3 py-2 text-sm transition-colors outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowConfirm(false);
                setDeleteText('');
              }}
              className="border-border text-muted-foreground hover:bg-muted flex-1 rounded-xl border py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDelete}
              disabled={deleteText.toLowerCase() !== 'delete'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex-1 rounded-xl py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Delete Everything
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Help & Support */
const FAQS = [
  {
    q: 'How do I start a workout?',
    a: 'Go to the Workouts tab and tap "Start Workout". You can choose from your templates or create a new one.',
  },
  {
    q: 'How do I track my nutrition?',
    a: 'Navigate to the Nutrition section to log meals, track macros, and set nutritional goals.',
  },
  {
    q: 'How do I view my progress?',
    a: 'The Progress section shows your weight trends, body measurements, and workout history.',
  },
  {
    q: 'How do achievements work?',
    a: 'Achievements are unlocked automatically as you hit milestones. Visit the Gamification section to see all available achievements.',
  },
  {
    q: 'Can I export my data?',
    a: 'Yes! Go to Settings &gt; Data Export to download all your data as a JSON file.',
  },
];

function HelpSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">Frequently Asked Questions</p>
      <div className="space-y-1">
        {FAQS.map((faq, i) => (
          <div key={i} className="border-border overflow-hidden rounded-xl border">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="text-foreground hover:bg-muted/50 flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium transition-colors"
            >
              {faq.q}
              {openFaq === i ? (
                <ChevronDown size={14} className="text-muted-foreground/50" />
              ) : (
                <ChevronRight size={14} className="text-muted-foreground/50" />
              )}
            </button>
            <AnimatePresence initial={false}>
              {openFaq === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="border-border text-muted-foreground border-t px-3 py-2.5 text-sm">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <p className="text-muted-foreground/60 pt-2 text-xs">
        Need more help? Reach out at{' '}
        <a href="mailto:support@hez.app" className="text-primary underline">
          support@hez.app
        </a>
      </p>
    </div>
  );
}

/* About */
function AboutSection() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center py-4">
        <div className="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl text-2xl font-bold">
          H
        </div>
        <p className="text-foreground mt-3 text-lg font-bold">Hêz</p>
        <p className="text-muted-foreground text-xs">Version {APP_VERSION}</p>
      </div>
      <div className="text-muted-foreground space-y-2 text-sm">
        <p>
          Hêz is a premium fitness tracking app designed to help you build consistency, track
          progress, and reach your fitness goals. Built with Next.js, TypeScript, and modern web
          technologies.
        </p>
        <p className="text-muted-foreground/60 text-xs">
          Made with dedication for the fitness community.
        </p>
      </div>
      <div className="bg-muted/30 rounded-xl p-3">
        <p className="text-foreground text-xs font-medium">Tech Stack</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Supabase'].map(
            (tech) => (
              <span
                key={tech}
                className="bg-muted text-muted-foreground rounded-lg px-2 py-0.5 text-[10px]"
              >
                {tech}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

/* Shared components */
function ToggleRow({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="hover:bg-muted/50 flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors">
      <div className="flex-1">
        <p className="text-foreground text-sm">{label}</p>
        <p className="text-muted-foreground/60 text-[10px]">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          enabled ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
