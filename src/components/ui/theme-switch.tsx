import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-muted hover:bg-muted/80"
      role="switch"
      aria-checked={isDark}
    >
      <span
        className={`h-5 w-5 transform rounded-full shadow-lg transition-transform duration-200 ease-in-out flex items-center justify-center ${
          isDark ? 'translate-x-5 bg-blue-600' : 'translate-x-1 bg-yellow-500'
        }`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-white" />
        ) : (
          <Sun className="h-3 w-3 text-white" />
        )}
      </span>
    </button>
  );
}
