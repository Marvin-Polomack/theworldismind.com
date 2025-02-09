"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import Particles from "@/components/ui/misc/particles";
import TwimLogoWhite from '@/components/icons/TwimLogoWhite';
import TwimLogoBlack from '@/components/icons/TwimLogoBlack';

const BackgroundParticles = () => {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  if (!theme) {
    return null; // or a loading spinner, or a default theme
  }

  return (
    <div className="fixed flex inset-0 w-full items-center justify-center">
      {theme === "dark" ? (
        <TwimLogoBlack className="h-screen py-20 opacity-25 light:color-black" />
      ) : (
        <TwimLogoWhite className="h-screen py-20 opacity-25 light:color-black" />
      )}
    
      <div className="fixed flex inset-0 w-full flex-col items-center justify-center overflow-hidden rounded-lg border md:shadow-xl">
        <Particles
          className="absolute inset-0 z-0"
          quantity={400}
          ease={80}
          color={theme === "dark" ? "#ada0ff" : "#ada0ff"}
          refresh
          size={2}
        />
      </div>
    </div>
  );
};

export default BackgroundParticles;
