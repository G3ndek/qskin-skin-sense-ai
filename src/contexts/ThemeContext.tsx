
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSystemTheme } from '@/lib/utils';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') as Theme : 'system';
    return savedTheme || 'system';
  });
  
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(
    typeof window !== 'undefined' ? getSystemTheme() : 'light'
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'system') {
      const systemTheme = getSystemTheme();
      
      root.classList.remove('dark', 'light');
      root.classList.add(systemTheme);
      setResolvedTheme(systemTheme);
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newSystemTheme = getSystemTheme();
        root.classList.remove('dark', 'light');
        root.classList.add(newSystemTheme);
        setResolvedTheme(newSystemTheme);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      root.classList.remove('dark', 'light');
      root.classList.add(theme);
      setResolvedTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
