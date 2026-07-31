'use client';

import * as React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  label?: string;
}

function Command({ open, onOpenChange, children, label = 'Search' }: CommandProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[15%] max-h-[60dvh] -translate-y-0 gap-0 p-0"
      >
        <CommandInputWrapper>
          <CommandInput autoFocus placeholder={`${label}...`} />
        </CommandInputWrapper>
        <CommandList>{children}</CommandList>
      </DialogContent>
    </Dialog>
  );
}

function CommandInputWrapper({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className={cn('border-border flex items-center gap-2 border-b px-4 py-3', className)}
      {...props}
    />
  );
}

function CommandInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <div className="flex flex-1 items-center gap-2">
      <Search size={18} className="text-muted-foreground shrink-0" />
      <input
        data-slot="command-input"
        className={cn(
          'text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none',
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="command-list" className={cn('overflow-y-auto py-2', className)} {...props} />
  );
}

function CommandEmpty({ children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="command-empty"
      className="text-muted-foreground py-12 text-center text-sm"
      {...props}
    >
      {children || 'No results found.'}
    </div>
  );
}

function CommandGroup({
  heading,
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & { heading?: string }) {
  return (
    <div data-slot="command-group" className={cn('py-1', className)} {...props}>
      {heading && (
        <div className="text-muted-foreground px-4 py-1.5 text-xs font-medium">{heading}</div>
      )}
      {children}
    </div>
  );
}

function CommandItem({
  className,
  onSelect,
  ...props
}: React.ComponentProps<'button'> & { onSelect?: () => void }) {
  return (
    <button
      data-slot="command-item"
      className={cn(
        'text-foreground hover:bg-muted aria-selected:bg-muted flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors',
        className,
      )}
      onClick={onSelect}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<'hr'>) {
  return (
    <hr
      data-slot="command-separator"
      className={cn('border-border mx-4 my-1', className)}
      {...props}
    />
  );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
      {...props}
    />
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
