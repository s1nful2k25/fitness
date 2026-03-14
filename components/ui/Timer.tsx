"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface TimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  className?: string;
  autoStart?: boolean;
}

export function Timer({ initialSeconds, onComplete, className, autoStart = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    setTimeLeft(initialSeconds);
    setIsRunning(autoStart);
  }, [initialSeconds, autoStart]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, onComplete]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(initialSeconds);
  };

  const isWarning = timeLeft > 0 && timeLeft <= 10;

  return (
    <div className={cn("flex items-center gap-4 border-[3px] border-brutal p-4", className, isWarning && "border-accent bg-accent/10")}>
        <div className={cn("font-mono text-4xl font-bold w-20 text-center transition-colors", isWarning ? "text-accent" : "text-[var(--fg)]")}>
          {timeLeft}s
        </div>
        <div className="flex gap-2">
            <Button size="sm" variant={isRunning ? "outline" : "primary"} onClick={toggle}>
                {isRunning ? "Pause" : "Start"}
            </Button>
            <Button size="sm" variant="ghost" onClick={reset}>
                Reset
            </Button>
        </div>
    </div>
  );
}
