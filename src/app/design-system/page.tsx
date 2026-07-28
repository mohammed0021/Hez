'use client';

import { MobileLayout } from '@/components/mobile-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress, ProgressLabel, ProgressValue } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { SuccessState } from '@/components/ui/success-state';
import { useToastStore } from '@/stores/toast-store';
import { useThemeStore } from '@/stores/theme-store';
import { themes, type ThemeId } from '@/types/theme';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Palette,
  Activity,
  Zap,
  Gift,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Plus,
} from 'lucide-react';
import { useState } from 'react';

const section = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

function SectionCard({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      variants={section}
      className="border-border/50 bg-card mb-8 rounded-2xl border p-4"
    >
      <h2 className="text-foreground mb-4 text-sm font-semibold">{title}</h2>
      {children}
    </motion.div>
  );
}

function ColorSwatch({ label, colorClass }: { label: string; colorClass: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className={`ring-foreground/10 size-10 rounded-xl ring-1 ${colorClass}`} />
      <span className="text-muted-foreground text-[11px]">{label}</span>
    </div>
  );
}

export default function DesignSystemPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const toast = useToastStore();
  const { themeId, setThemeId, mode, setMode } = useThemeStore();

  const themeColors = [
    { label: 'Primary', class: 'bg-primary' },
    { label: 'Secondary', class: 'bg-secondary' },
    { label: 'Accent', class: 'bg-accent' },
    { label: 'Background', class: 'bg-background ring-1 ring-border' },
    { label: 'Card', class: 'bg-card ring-1 ring-border' },
    { label: 'Muted', class: 'bg-muted' },
    { label: 'Destructive', class: 'bg-destructive' },
    { label: 'Success', class: 'bg-success' },
    { label: 'Warning', class: 'bg-warning' },
    { label: 'Info', class: 'bg-info' },
    { label: 'Border', class: 'bg-border' },
    { label: 'Ring', class: 'bg-ring' },
  ];

  return (
    <MobileLayout
      title="Design System"
      rightAction={
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
            className="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-lg"
          >
            {mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      }
    >
      <div className="pt-4 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-2 flex items-center gap-2">
            <div className="bg-primary flex size-8 items-center justify-center rounded-xl">
              <Palette size={18} className="text-primary-foreground" />
            </div>
            <h1 className="text-foreground text-2xl font-bold">Design System</h1>
          </div>
          <p className="text-muted-foreground mb-6 text-sm">
            Complete component library for Hêz &mdash; {themes.find((t) => t.id === themeId)?.emoji}{' '}
            {themes.find((t) => t.id === themeId)?.label}
          </p>
        </motion.div>

        <SectionCard title="Theme Switcher" id="themes">
          <p className="text-muted-foreground mb-3 text-xs">
            Click any theme to apply instantly without reload
          </p>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id as ThemeId)}
                className={`flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all ${
                  themeId === t.id
                    ? 'bg-primary/15 ring-primary ring-2'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span className="text-xl">{t.emoji}</span>
                <span className="text-foreground text-center text-[10px] leading-tight font-medium">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Colors" id="colors">
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-12">
            {themeColors.map((c) => (
              <ColorSwatch key={c.label} label={c.label} colorClass={c.class} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Typography" id="typography">
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground mb-1 text-xs">Font: Geist Sans (system)</p>
              <div className="space-y-1">
                <p className="text-foreground text-5xl font-bold">Hêz</p>
                <p className="text-foreground text-3xl font-bold">Hêz</p>
                <p className="text-foreground text-2xl font-semibold">Hêz Strength</p>
                <p className="text-foreground text-xl font-medium">Hêz Strength</p>
                <p className="text-foreground text-base">Hêz Strength Training</p>
                <p className="text-muted-foreground text-sm">Hêz Strength Training App</p>
                <p className="text-muted-foreground text-xs">Hêz Strength Training App v1.0</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Spacing & Radius" id="spacing">
          <div className="space-y-3">
            <div>
              <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
                Border Radius Scale
              </p>
              <div className="flex flex-wrap gap-2">
                {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'].map((r) => (
                  <div
                    key={r}
                    className={`bg-primary/20 text-primary flex size-10 items-center justify-center text-[10px] font-medium`}
                    style={{ borderRadius: `var(--radius-${r})` }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
                Spacing Scale (p-2 through p-8)
              </p>
              <div className="flex items-end gap-1">
                {[2, 3, 4, 5, 6, 8].map((s) => (
                  <div
                    key={s}
                    className="bg-primary/30 rounded"
                    style={{ width: `${s * 4}px`, height: `${s * 4}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Shadows" id="shadows">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['sm', 'md', 'lg', 'xl'].map((s) => (
              <div
                key={s}
                className="bg-card text-muted-foreground flex h-16 items-center justify-center rounded-xl text-xs font-medium"
                style={{ boxShadow: `var(--shadow-${s}, 0 1px 3px 0 rgb(0 0 0 / 0.1))` }}
              >
                {s}
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Buttons" id="buttons">
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
                Variants
              </p>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
                Sizes
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="xs">XS</Button>
                <Button size="sm">SM</Button>
                <Button size="default">Default</Button>
                <Button size="lg">LG</Button>
                <Button size="icon" aria-label="Icon">
                  <Plus size={16} />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
                With Icons
              </p>
              <div className="flex flex-wrap gap-2">
                <Button>
                  <Bell size={16} />
                  Notifications
                </Button>
                <Button variant="outline">
                  <Settings size={16} />
                  Settings
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Inputs" id="inputs">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-default">Default Input</Label>
              <Input id="input-default" placeholder="Placeholder text..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-disabled">Disabled</Label>
              <Input id="input-disabled" placeholder="Disabled..." disabled />
            </div>
            <div>
              <p className="text-muted-foreground/60 mb-2 text-[10px] font-medium tracking-wider uppercase">
                With Switch Toggle
              </p>
              <div className="flex items-center gap-3">
                <Switch id="switch1" />
                <Label htmlFor="switch1">Enable notifications</Label>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <Switch id="switch2" size="sm" />
                <Label htmlFor="switch2">Compact mode</Label>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Cards" id="cards">
          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>Full card with all sections</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Card content goes here. This card has a header, content, and footer section.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
            <Card size="sm">
              <CardHeader>
                <CardTitle>Compact Card</CardTitle>
                <CardDescription>Smaller spacing variant</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">Perfect for list items.</p>
              </CardContent>
            </Card>
          </div>
        </SectionCard>

        <SectionCard title="Tabs" id="tabs">
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab One</TabsTrigger>
              <TabsTrigger value="tab2">Tab Two</TabsTrigger>
              <TabsTrigger value="tab3">Tab Three</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="pt-3">
              <p className="text-muted-foreground text-sm">Content for tab one.</p>
            </TabsContent>
            <TabsContent value="tab2" className="pt-3">
              <p className="text-muted-foreground text-sm">Content for tab two.</p>
            </TabsContent>
            <TabsContent value="tab3" className="pt-3">
              <p className="text-muted-foreground text-sm">Content for tab three.</p>
            </TabsContent>
          </Tabs>
          <div className="mt-4">
            <Tabs defaultValue="tab1">
              <TabsList variant="line">
                <TabsTrigger value="tab1">Line</TabsTrigger>
                <TabsTrigger value="tab2">Tabs</TabsTrigger>
                <TabsTrigger value="tab3">Variant</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </SectionCard>

        <SectionCard title="Badges" id="badges">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="ghost">Ghost</Badge>
            <Badge variant="link">Link</Badge>
          </div>
        </SectionCard>

        <SectionCard title="Dropdown Menu" id="dropdowns">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                Open Dropdown <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User size={16} />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings size={16} />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Gift size={16} />
                Premium
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut size={16} />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SectionCard>

        <SectionCard title="Dialog / Modal" id="dialogs">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <Button variant="default">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Are you sure you want to proceed?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setDialogOpen(false);
                    toast.success('Action confirmed!');
                  }}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </SectionCard>

        <SectionCard title="Popover" id="popovers">
          <Popover>
            <PopoverTrigger>
              <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <p className="text-foreground text-sm font-medium">Notifications</p>
                <p className="text-muted-foreground text-xs">You have 3 unread notifications.</p>
                <Button size="sm" className="w-full">
                  View all
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </SectionCard>

        <SectionCard title="Avatar" id="avatars">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>HZ</AvatarFallback>
            </Avatar>
            <Avatar className="size-10">
              <AvatarFallback className="text-xs">HZ</AvatarFallback>
            </Avatar>
          </div>
        </SectionCard>

        <SectionCard title="Progress Bars" id="progress">
          <div className="space-y-4">
            <Progress value={45}>
              <ProgressLabel>Workout Progress</ProgressLabel>
              <ProgressValue />
            </Progress>
            <Progress value={78}>
              <ProgressLabel>Weekly Goal</ProgressLabel>
              <ProgressValue />
            </Progress>
            <Progress value={100}>
              <ProgressLabel>Completed</ProgressLabel>
              <ProgressValue />
            </Progress>
          </div>
        </SectionCard>

        <SectionCard title="Skeleton Loaders" id="skeletons">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-2 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-24 w-full rounded-xl" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Toast Notifications" id="toasts">
          <div className="space-y-3">
            <p className="text-muted-foreground text-xs">Tap to trigger different toast variants</p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  toast.success('Workout saved!', { description: 'Your progress has been updated' })
                }
              >
                Success Toast
              </Button>
              <Button
                variant="destructive"
                onClick={() =>
                  toast.error('Failed to save', { description: 'Check your connection' })
                }
              >
                Error Toast
              </Button>
              <Button
                variant="secondary"
                onClick={() => toast.warning('Running low', { description: 'Storage almost full' })}
              >
                Warning Toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.info('New update available', { description: 'v2.1.0 is ready' })
                }
              >
                Info Toast
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Empty State" id="empty">
          <EmptyState
            icon={<Activity size={28} className="text-muted-foreground" />}
            title="No workouts yet"
            description="Start your fitness journey by creating your first workout."
            action={
              <Button size="sm">
                <Plus size={16} />
                Create Workout
              </Button>
            }
          />
        </SectionCard>

        <SectionCard title="Error State" id="error">
          <ErrorState
            title="Failed to load"
            description="Could not fetch workout data. Please try again."
            onRetry={() => toast.info('Retrying...')}
          />
        </SectionCard>

        <SectionCard title="Success State" id="success">
          <SuccessState
            title="Workout Complete!"
            description="You crushed it today. 450 calories burned."
            action={<Button size="sm">View Summary</Button>}
          />
        </SectionCard>

        <SectionCard title="Command (⌘K)" id="command">
          <p className="text-muted-foreground mb-3 text-xs">Press to open command palette</p>
          <Button
            variant="outline"
            onClick={() => toast.info('Cmd+K would open here in production')}
          >
            <Zap size={16} />
            Open Command Palette
          </Button>
        </SectionCard>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-xs">
            Hêz Design System v1.0 &middot; {themes.find((t) => t.id === themeId)?.emoji}{' '}
            {themes.find((t) => t.id === themeId)?.label}
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
