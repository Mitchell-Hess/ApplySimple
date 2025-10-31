import * as React from 'react';
import { Providers } from '@/components/Providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ overflowX: 'hidden' }}>
      <body style={{ overflowX: 'hidden', margin: 0, padding: 0 }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

