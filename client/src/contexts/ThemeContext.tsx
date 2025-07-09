
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export const COLOR_OPTIONS = [
  { id: 'indigo', name: 'Indigo', value: '46.12% 0.22 286.95' },
  { id: 'teal', name: 'Teal', value: '53.25% 0.08 196.88' },
  { id: 'zinc', name: 'Zinc', value: '52.41% 0.01 275.28' },
  { id: 'rose', name: 'Rose', value: '64.93% 0.17 11.23' },
  { id: 'orange', name: 'Orange', value: '69.75% 0.16 52.88' },
];

export const RADIUS_OPTIONS = [
  { id: '0', name: 'None' },
  { id: '0.3', name: 'Small' },
  { id: '0.5', name: 'Medium' },
  { id: '0.75', name: 'Large' },
  { id: '1.0', name: 'Full' },
];

type ThemeState = {
  currentColor: string;
  currentRadius: string;
  isDarkMode: boolean;
  setColor: (color: string) => void;
  setRadius: (radius: string) => void;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeState | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const { theme: mode, setTheme } = useNextTheme();
  const [isMounted, setIsMounted] = useState(false);
  
  const [color, rawSetColor] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme-color') || 'indigo';
    }
    return 'indigo';
  });

  const [radius, rawSetRadius] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme-radius') || '0.5';
    }
    return '0.5';
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      document.documentElement.style.setProperty('--radius', `${radius}rem`);
      const selectedColor = COLOR_OPTIONS.find(c => c.id === color);
      if (selectedColor) {
        document.documentElement.style.setProperty('--primary', selectedColor.value);
        document.documentElement.style.setProperty('--ring', selectedColor.value);
      }
    }
  }, [color, radius, isMounted]);

  const setColor = (newColor: string) => {
    rawSetColor(newColor);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-color', newColor);
    }
  };

  const setRadius = (newRadius: string) => {
    rawSetRadius(newRadius);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-radius', newRadius);
    }
  };

  const isDarkMode = mode === 'dark';

  const value = useMemo(() => ({
    currentColor: color,
    currentRadius: radius,
    isDarkMode,
    setColor,
    setRadius,
    setTheme,
  }), [color, radius, isDarkMode, setColor, setRadius, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within an AppThemeProvider');
  }
  return context;
};
