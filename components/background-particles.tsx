"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import Particles from "@/components/ui/particles";
import TwimLogoBlack from '@/components/icons/TwimLogoBlack';

export function BackgroundParticles() {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ada0ff");

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ada0ff" : "#ada0ff");
  }, [resolvedTheme]);

  return (
    <div className="fixed flex inset-0 w-full items-center justify-center">
      <TwimLogoBlack className="h-screen py-20 opacity-25" />
    
    <div className="fixed flex inset-0 w-full flex-col items-center justify-center overflow-hidden rounded-lg border md:shadow-xl">
      <Particles
        className="absolute inset-0 z-0"
        quantity={400}
        ease={80}
        color={color}
        refresh
        size={2}
      />
    </div>
    </div>
  );
}
