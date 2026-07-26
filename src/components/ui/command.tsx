"use client"

import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface CommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  label?: string
}

function Command({ open, onOpenChange, children, label = "Search" }: CommandProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[15%] -translate-y-0 max-h-[60dvh] p-0 gap-0"
      >
        <CommandInputWrapper>
          <CommandInput autoFocus placeholder={`${label}...`} />
        </CommandInputWrapper>
        <CommandList>
          {children}
        </CommandList>
      </DialogContent>
    </Dialog>
  )
}

function CommandInputWrapper({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-input-wrapper"
      className={cn(
        "flex items-center gap-2 border-b border-border px-4 py-3",
        className
      )}
      {...props}
    />
  )
}

function CommandInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="flex flex-1 items-center gap-2">
      <Search size={18} className="shrink-0 text-muted-foreground" />
      <input
        data-slot="command-input"
        className={cn(
          "flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-list"
      className={cn("overflow-y-auto py-2", className)}
      {...props}
    />
  )
}

function CommandEmpty({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="command-empty"
      className="py-12 text-center text-sm text-muted-foreground"
      {...props}
    >
      {children || "No results found."}
    </div>
  )
}

function CommandGroup({
  heading,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { heading?: string }) {
  return (
    <div
      data-slot="command-group"
      className={cn("py-1", className)}
      {...props}
    >
      {heading && (
        <div className="px-4 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </div>
      )}
      {children}
    </div>
  )
}

function CommandItem({
  className,
  onSelect,
  ...props
}: React.ComponentProps<"button"> & { onSelect?: () => void }) {
  return (
    <button
      data-slot="command-item"
      className={cn(
        "flex w-full items-center gap-2 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted aria-selected:bg-muted",
        className
      )}
      onClick={onSelect}
      {...props}
    />
  )
}

function CommandSeparator({ className, ...props }: React.ComponentProps<"hr">) {
  return (
    <hr
      data-slot="command-separator"
      className={cn("my-1 mx-4 border-border", className)}
      {...props}
    />
  )
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
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
}
