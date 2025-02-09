'use client'

import { useContext, useEffect, useRef } from 'react';
import { DockElement } from './ui/Dock/Dock';
import { DockContext } from '@/components/ChatContainer'

export default function DockWrapper() {
  const dockRef = useRef<HTMLDivElement>(null);
  const { setDockPosition } = useContext(DockContext)
  const { dockPosition } = useContext(DockContext)

  useEffect(() => {
    if (dockRef.current) {
      const { x, y } = dockRef.current.getBoundingClientRect();
      setDockPosition({ x, y });
    }
  }, []);

  useEffect(() => {
    console.log(dockPosition);
  }, [dockPosition]);

  return <DockElement ref={dockRef} />;
}