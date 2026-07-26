'use client';

import { Share2, Download, Upload, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useWorkoutStore } from '@/stores/workout-store';

export function ShareDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
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
      setImportError('Invalid workout JSON format');
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
            className="w-full max-w-md rounded-2xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
              <Share2 size={16} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">Share & Export</span>
            </div>

            <div className="flex border-b border-border/50">
              <button
                onClick={() => setTab('export')}
                className={`flex-1 py-2.5 text-xs font-medium text-center transition-colors ${
                  tab === 'export' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Download size={14} className="inline mr-1" /> Export
              </button>
              <button
                onClick={() => setTab('import')}
                className={`flex-1 py-2.5 text-xs font-medium text-center transition-colors ${
                  tab === 'import' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Upload size={14} className="inline mr-1" /> Import
              </button>
            </div>

            <div className="p-4">
              {tab === 'export' ? (
                <div className="space-y-3">
                  <textarea
                    readOnly
                    value={json}
                    className="w-full h-32 rounded-xl border border-border/30 bg-muted p-3 text-[10px] text-foreground font-mono resize-none focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                      {copied ? 'Copied!' : 'Copy JSON'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1.5 rounded-xl bg-muted px-4 py-2 text-xs font-medium text-foreground hover:bg-muted/80"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste workout JSON here..."
                    className="w-full h-32 rounded-xl border border-border/30 bg-muted p-3 text-[10px] text-foreground font-mono resize-none placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none"
                  />
                  {importError && <p className="text-[10px] text-red-500">{importError}</p>}
                  <button
                    onClick={handleImport}
                    disabled={!importText.trim()}
                    className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
                  >
                    <Upload size={14} /> Import Workout
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
