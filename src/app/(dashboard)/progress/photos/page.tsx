'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Trash2, Plus, CalendarDays } from 'lucide-react';
import { usePhotoStore } from '@/stores/photo-store';
import { BeforeAfterSlider } from '@/components/progress/before-after-slider';

export default function PhotosPage() {
  const { photos, addPhoto, deletePhoto } = usePhotoStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      addPhoto({
        date: new Date().toISOString().slice(0, 10),
        title: title || 'Progress Photo',
        dataUrl,
        tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      });
      setTitle('');
      setTags('');
    };
    reader.readAsDataURL(file);
  };

  // For before/after: pair the 2 most recent photos
  const recent = [...photos].slice(0, 2);
  const canCompare = recent.length === 2;

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Progress Photos</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{photos.length} photos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleFileSelect} className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">
            <Plus size={14} /> Add Photo
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>
      </div>

      {photos.length > 0 && (
        <div className="mt-4">
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Photo title (optional)" className="w-full rounded-xl border border-border/30 bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags: front, back, flexed (optional)" className="mt-2 w-full rounded-xl border border-border/30 bg-card px-3 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none" />
        </div>
      )}

      {/* Before/After Slider */}
      {canCompare && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Before / After</p>
          <BeforeAfterSlider
            beforeUrl={recent[1]!.dataUrl}
            afterUrl={recent[0]!.dataUrl}
            beforeLabel={recent[1]!.title}
            afterLabel={recent[0]!.title}
          />
        </motion.div>
      )}

      {/* Photo Grid */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="group relative rounded-2xl overflow-hidden bg-muted aspect-square"
          >
            <img src={photo.dataUrl} alt={photo.title} className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-xs text-white font-medium truncate">{photo.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CalendarDays size={10} className="text-white/70" />
                  <span className="text-[9px] text-white/70">{new Date(photo.date).toLocaleDateString()}</span>
                </div>
                {photo.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {photo.tags.map((t) => (
                      <span key={t} className="rounded-full bg-white/20 px-1.5 py-0.5 text-[8px] text-white">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => deletePhoto(photo.id)} className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/40 text-white/70 hover:text-red-400">
                <Trash2 size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <Camera size={48} className="text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground text-center max-w-xs">No progress photos yet. Take your first photo to start tracking your transformation.</p>
          <button onClick={handleFileSelect} className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
            <Camera size={14} /> Take Photo
          </button>
        </div>
      )}

      <div className="h-8" />
    </>
  );
}
