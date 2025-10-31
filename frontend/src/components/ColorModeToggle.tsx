'use client';

import { Button } from '@chakra-ui/react';
import { useColorMode } from '@/lib/color-mode';
import { FiSun, FiMoon } from 'react-icons/fi';

export function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button
      onClick={toggleColorMode}
      size="md"
      variant="ghost"
      p={2}
      borderRadius="lg"
      _hover={{ bg: colorMode === 'light' ? 'gray.100' : 'gray.700' }}
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
    >
      {colorMode === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
    </Button>
  );
}
