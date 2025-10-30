'use client';
import * as React from 'react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ReactQueryProvider } from '@/lib/react-query';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider value={defaultSystem}>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}

