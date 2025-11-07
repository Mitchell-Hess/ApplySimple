'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export function ColorModeProvider({ children }: { children: ReactNode }) {
  // Always initialize with 'light' for SSR
  const [colorMode, setColorModeState] = useState<ColorMode>('light');
  const [isMounted, setIsMounted] = useState(false);

  // Load saved color mode after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('chakra-ui-color-mode') as ColorMode | null;
    if (saved && (saved === 'light' || saved === 'dark')) {
      setColorModeState(saved);
    }
  }, []);

  useEffect(() => {
    // Apply the color mode to DOM
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Only save to localStorage after mount
    if (isMounted) {
      localStorage.setItem('chakra-ui-color-mode', colorMode);
    }
  }, [colorMode, isMounted]);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem('chakra-ui-color-mode', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  };

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within ColorModeProvider');
  }
  return context;
}
