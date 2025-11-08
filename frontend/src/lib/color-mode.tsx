'use client';

import { createContext, useContext, useState, useLayoutEffect, useRef, ReactNode } from 'react';

type ColorMode = 'light' | 'dark';

interface ColorModeContextType {
  colorMode: ColorMode;
  toggleColorMode: () => void;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export function ColorModeProvider({ children }: { children: ReactNode }) {
  // Always start with 'light' for SSR consistency
  const [colorMode, setColorModeState] = useState<ColorMode>('light');
  const mountedRef = useRef(false);

  // Use layout effect to apply theme before paint
  useLayoutEffect(() => {
    // Apply saved preference on mount
    if (typeof window !== 'undefined' && !mountedRef.current) {
      mountedRef.current = true;
      const saved = localStorage.getItem('chakra-ui-color-mode') as ColorMode | null;
      if (saved && (saved === 'light' || saved === 'dark')) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setColorModeState(saved);
        // Apply immediately to DOM
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }
  }, []);

  // Apply color mode changes to DOM
  useLayoutEffect(() => {
    if (!mountedRef.current) return;

    // Apply the color mode to DOM
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save to localStorage
    localStorage.setItem('chakra-ui-color-mode', colorMode);
  }, [colorMode]);

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
