'use client';
import * as React from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ReactQueryProvider } from '@/lib/react-query';
import { ColorModeProvider } from '@/lib/color-mode';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ overflowX: 'hidden' }}>
      <body style={{ overflowX: 'hidden', margin: 0, padding: 0 }}>
        <ChakraProvider value={defaultSystem}>
          <ColorModeProvider>
            <ReactQueryProvider>
              {children}
            </ReactQueryProvider>
          </ColorModeProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}

