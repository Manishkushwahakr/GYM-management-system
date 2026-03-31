'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 scale-100 transition-all dark:scale-0 dark:opacity-0" />
      <Moon className="absolute h-5 w-5 scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100" />
    </button>
  );
}
