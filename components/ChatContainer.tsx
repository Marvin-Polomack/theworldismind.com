'use client'

import { createContext, useState } from 'react'
import { useEffect } from 'react'

export const DockContext = createContext({
  dockPosition: { x: 0, y: 0 },
  setDockPosition: (position: { x: number, y: number }) => {}
})

export default function ChatContainer({ children }) {
  const [dockPosition, setDockPosition] = useState({ x: 90, y: 100 })
  
  useEffect(() => {
    const isSmartphone = /Mobi|Android/i.test(navigator.userAgent);
    if (isSmartphone) {
      setDockPosition({ x: 0, y: 0 });
    } else {
      setDockPosition({ x: 150, y: 150 });
    }
  }, []);
  
  return (
    <DockContext.Provider value={{ dockPosition, setDockPosition }}>
      {children}
    </DockContext.Provider>
  )
}