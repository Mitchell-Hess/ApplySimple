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
  // Always initialize with 'light' to match SSR
  const [colorMode, setColorModeState] = useState<ColorMode>('light');

  useEffect(() => {
    // After hydration, read and apply saved color mode from localStorage
    const saved = localStorage.getItem('chakra-ui-color-mode') as ColorMode | null;
    if (saved) {
      // Only update if there's a saved preference and it differs from default
      setColorModeState(saved);
      document.documentElement.classList.add('dark');
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
