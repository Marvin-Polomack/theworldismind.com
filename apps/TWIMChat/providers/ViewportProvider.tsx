'use client';

import { createContext, useContext, useEffect } from 'react';
import { use100vh } from 'react-div-100vh';

const ViewportContext = createContext<{
  viewportHeight: number | null;
}>({
  viewportHeight: null,
});

export function ViewportProvider({ children }: { children: React.ReactNode }) {
  const viewportHeight = use100vh();

  useEffect(() => {
    // Update CSS variable for real viewport height
    if (viewportHeight) {
      document.documentElement.style.setProperty('--real-vh', `${viewportHeight}px`);
    }
  }, [viewportHeight]);

  return (
    <ViewportContext.Provider value={{ viewportHeight }}>
      {children}
    </ViewportContext.Provider>
  );
}

export const useViewport = () => useContext(ViewportContext); 