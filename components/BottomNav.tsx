"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Dumbbell, Calendar, BookOpen, User, Info } from 'lucide-react';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dash', icon: Home },
    { href: '/workout', label: 'Workout', icon: Dumbbell },
    { href: '/plan', label: 'Plan', icon: Calendar },
    { href: '/log', label: 'Log', icon: BookOpen },
    { href: '/body', label: 'Körper', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg)] border-t-[3px] border-brutal z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-between items-stretch h-[60px] md:h-[70px] overflow-x-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center min-w-[64px] border-r-[3px] border-brutal last:border-r-0 transition-none",
                isActive ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg)] hover:bg-gray-200"
              )}
            >
              <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 3 : 2} />
              <span className="font-display uppercase text-xs tracking-wider leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
        {/* Extras like Info / Exercises grouped at the end */}
        <Link 
            href="/exercises"
            className={cn(
            "flex-1 flex flex-col items-center justify-center min-w-[64px] border-r-[3px] border-brutal last:border-r-0 transition-none",
            pathname.startsWith('/exercises') || pathname.startsWith('/info') ? "bg-[var(--fg)] text-[var(--bg)]" : "text-[var(--fg)] hover:bg-gray-200"
            )}
        >
            <Info className="w-5 h-5 mb-1" strokeWidth={pathname.startsWith('/exercises') || pathname.startsWith('/info') ? 3 : 2} />
            <span className="font-display uppercase text-xs tracking-wider leading-none">
            Info
            </span>
        </Link>
      </div>
    </nav>
  );
}
