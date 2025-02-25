'use client';
import WelcomeScreen from '@/components/WelcomeScreen';
import { useState } from 'react';
import { DynamicIslandMenu } from '@/components/HamburgerMenu/HamburgerMenu';

export default function Home() {

  return (
    <main className="relative">
      {/* {isOpen && (
        <DynamicIslandMenu />
      )} */}
      <WelcomeScreen />
    </main>
  );
}