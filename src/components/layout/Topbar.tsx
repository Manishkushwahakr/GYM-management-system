import { ThemeToggle } from '@/components/ThemeToggle';

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm flex items-center px-8 sticky top-0 z-30 transition-colors duration-300">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        <ThemeToggle />
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}
