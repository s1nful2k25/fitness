import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-display uppercase tracking-[0.1em] transition-none focus-visible:outline-none focus-visible:ring-0 active:translate-y-[2px] disabled:opacity-50 disabled:pointer-events-none",
          "border-[3px] border-brutal transition-colors duration-0",
          {
            'bg-accent text-white hover:bg-[var(--fg)] hover:text-[var(--bg)]': variant === 'primary',
            'bg-transparent text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]': variant === 'outline',
            'border-transparent hover:border-brutal bg-transparent text-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]': variant === 'ghost',
            'h-10 px-4 text-lg': size === 'sm',
            'h-12 px-6 text-xl': size === 'md',
            'h-16 px-8 text-2xl': size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
