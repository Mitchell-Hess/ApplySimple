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
  // Always initialize with 'light' to match SSR, then update from localStorage after hydration
  const [colorMode, setColorModeState] = useState<ColorMode>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // After hydration, read from localStorage and update state
    const saved = localStorage.getItem('chakra-ui-color-mode') as ColorMode | null;
    if (saved && saved !== colorMode) {
      setColorModeState(saved);
    }
    document.documentElement.classList.toggle('dark', (saved || 'light') === 'dark');
    setIsHydrated(true);
  }, []);

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
