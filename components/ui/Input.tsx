import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && <label className="font-display tracking-[0.05em] uppercase text-lg">{label}</label>}
        <input
          ref={ref}
          className={cn(
            "flex h-12 w-full border-[2px] border-brutal bg-transparent px-3 py-2 text-base font-mono placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 transition-none",
            className
          )}
          {...props}
        />
        {error && <p className="font-mono text-sm text-accent">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
