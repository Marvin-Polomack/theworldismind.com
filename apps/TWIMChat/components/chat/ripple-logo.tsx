'use client';
import { Ripple } from "@/components/magicui/ripple";
import TwimLogoBlack from '@/components/icons/TwimLogoBlack';
import TwimLogoWhite from '@/components/icons/TwimLogoWhite';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function RippleLogo() {
    const { resolvedTheme } = useTheme();
    const [theme, setTheme] = useState<string | null>(null);

    useEffect(() => {
    if (resolvedTheme) {
        setTheme(resolvedTheme);
    }
    }, [resolvedTheme]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent">
      {theme === "dark" ? (
        <TwimLogoBlack className="svg-logo py-20 h-80 opacity-50 light:color-black" />
      ) : (
        <TwimLogoWhite className="h-screen py-20 opacity-50 light:color-black" />
      )}
      <Ripple />
    </div>
  );
}
