'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ColorModeProvider } from '@/lib/color-mode';
import { ChakraProvider } from '@chakra-ui/react';
import { system } from '@/theme';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={system}>
          <ColorModeProvider>
            {children}
          </ColorModeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
