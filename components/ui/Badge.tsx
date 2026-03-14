import React from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'accent' | 'outline' }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 border-[2px] font-mono text-xs font-bold uppercase tracking-widest",
        {
          "border-brutal bg-[var(--fg)] text-[var(--bg)]": variant === 'default',
          "border-transparent bg-accent text-[var(--bg)]": variant === 'accent',
          "border-brutal bg-transparent text-[var(--fg)]": variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
