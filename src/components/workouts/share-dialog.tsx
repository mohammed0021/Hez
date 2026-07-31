'use client';

import { Share2, Download, Upload, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useWorkoutStore } from '@/stores/workout-store';

export function ShareDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations('workouts');
  const c = useTranslations('common');
  const exportToJson = useWorkoutStore((s) => s.exportToJson);
  const importFromJson = useWorkoutStore((s) => s.importFromJson);
  const [tab, setTab] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const json = exportToJson();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workout.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    setImportError('');
    const success = importFromJson(importText);
    if (success) {
      onClose();
      setImportText('');
    } else {
      setImportError(t('invalid_json'));
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border-border/50 w-full max-w-md rounded-2xl border"
          >
            <div className="border-border/50 flex items-center gap-3 border-b px-4 py-3">
              <Share2 size={16} className="text-primary" />
              <span className="text-foreground text-sm font-semibold">{t('share_export')}</span>
            </div>

            <div className="border-border/50 flex border-b">
              <button
                onClick={() => setTab('export')}
                className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
                  tab === 'export'
                    ? 'text-primary border-primary border-b-2'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Download size={14} className="mr-1 inline" /> {c('export')}
              </button>
              <button
                onClick={() => setTab('import')}
                className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
                  tab === 'import'
                    ? 'text-primary border-primary border-b-2'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Upload size={14} className="mr-1 inline" /> {c('import')}
              </button>
            </div>

            <div className="p-4">
              {tab === 'export' ? (
                <div className="space-y-3">
                  <textarea
                    readOnly
                    value={json}
                    className="border-border/30 bg-muted text-foreground h-32 w-full resize-none rounded-xl border p-3 font-mono text-[10px] focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? c('copied') : t('copy_json')}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="bg-muted text-foreground hover:bg-muted/80 flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium"
                    >
                      <Download size={14} /> {c('download')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder={t('paste_json_placeholder')}
                    className="border-border/30 bg-muted text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 h-32 w-full resize-none rounded-xl border p-3 font-mono text-[10px] focus:outline-none"
                  />
                  {importError && <p className="text-[10px] text-red-500">{importError}</p>}
                  <button
                    onClick={handleImport}
                    disabled={!importText.trim()}
                    className="bg-primary text-primary-foreground flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium disabled:opacity-50"
                  >
                    <Upload size={14} /> {t('import_workout')}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
