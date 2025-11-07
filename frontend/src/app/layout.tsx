import * as React from 'react';
import { Providers } from '@/components/Providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ApplySimple - Job Application Tracker',
  description: 'Track your job applications with ease',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

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

