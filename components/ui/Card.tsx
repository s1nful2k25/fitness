import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-[3px] border-brutal bg-[var(--bg)] p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-b-[3px] border-brutal -mx-6 -mt-6 mb-6 p-6 font-display text-2xl uppercase tracking-wider bg-[var(--fg)] text-[var(--bg)]", className)} {...props}>
      {children}
    </div>
  );
}
