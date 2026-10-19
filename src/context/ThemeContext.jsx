'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Deferred so state is set from a callback rather than synchronously in the effect body
    queueMicrotask(() => {
      try {
        const savedTheme = localStorage.getItem('valkyrie_theme');
        setTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light');
      } catch {
        setTheme('light');
      } finally {
        setMounted(true);
      }
    });
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      try {
        localStorage.setItem('valkyrie_theme', theme);
      } catch (e) {
        console.error(e);
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
