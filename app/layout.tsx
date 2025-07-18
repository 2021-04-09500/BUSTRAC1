// app/layout.tsx
import { Inter } from 'next/font/google';
import './ui/globals.css';
import { ReactNode } from 'react';
import LoadingWrapper from './ui/Loading/LoadingWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingWrapper>{children}</LoadingWrapper>
      </body>
    </html>
  );
}
