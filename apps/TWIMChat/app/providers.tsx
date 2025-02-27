import './globals.css';
import { ThemeProvider } from "@/components/theme-provider"
import BackgroundParticles from "@/components/background-particles"
import { Suspense } from 'react'
import Loading from './loading';
import SupabaseProvider from '../utils/supabase/supabase-provider';
import { Toaster } from "sonner";

import { ReactNode } from 'react';

export default function Providers({children}: {children: ReactNode}) {
  return (
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
              <Toaster 
                theme="dark" 
                richColors 
                closeButton
                position="top-center" 
              />
          </Suspense>
      </SupabaseProvider>
    </ThemeProvider>
  )
}