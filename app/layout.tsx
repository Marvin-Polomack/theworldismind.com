import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"
import { BackgroundParticles } from "@/components/background-particles"
import { Suspense } from 'react'
import Loading from './loading';
import SupabaseProvider from './supabase-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The World Is Mind',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <BackgroundParticles />
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
