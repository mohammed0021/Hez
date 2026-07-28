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
          <h1 className="text-foreground text-2xl font-bold">Progress Photos</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{photos.length} photos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFileSelect}
            className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium"
          >
            <Plus className="size-4" /> Add Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {photos.length > 0 && (
        <div className="mt-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Photo title (optional)"
            className="border-border/30 bg-card text-foreground focus:border-primary/40 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags: front, back, flexed (optional)"
            className="border-border/30 bg-card text-foreground focus:border-primary/40 mt-2 w-full rounded-xl border px-3 py-2.5 text-sm focus:outline-none"
          />
        </div>
      )}

      {/* Before/After Slider */}
      {canCompare && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-5"
        >
          <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-wider uppercase">
            Before / After
          </p>
          <BeforeAfterSlider
            beforeUrl={recent[1]!.dataUrl}
            afterUrl={recent[0]!.dataUrl}
            beforeLabel={recent[1]!.title}
            afterLabel={recent[0]!.title}
          />
        </motion.div>
      )}

      {/* Photo Grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {photos.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            className="group bg-muted relative aspect-square overflow-hidden rounded-2xl"
          >
            <img src={photo.dataUrl} alt={photo.title} className="size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <div className="absolute right-0 bottom-0 left-0 p-2">
                <p className="truncate text-xs font-medium text-white">{photo.title}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <CalendarDays className="size-4 text-white/70" />
                  <span className="text-[9px] text-white/70">
                    {new Date(photo.date).toLocaleDateString()}
                  </span>
                </div>
                {photo.tags.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {photo.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-white/20 px-1.5 py-0.5 text-[8px] text-white"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => deletePhoto(photo.id)}
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/40 text-white/70 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <Camera size={48} className="text-muted-foreground/20" />
          <p className="text-muted-foreground max-w-xs text-center text-sm">
            No progress photos yet. Take your first photo to start tracking your transformation.
          </p>
          <button
            onClick={handleFileSelect}
            className="bg-primary text-primary-foreground flex min-h-[44px] items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium"
          >
            <Camera className="size-4" /> Take Photo
          </button>
        </div>
      )}

      <div className="h-8" />
    </>
  );
}
