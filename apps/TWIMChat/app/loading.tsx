"use client";
import TwimLogoBlack from '@/components/icons/TwimLogoBlack';
import TwimLogoWhite from '@/components/icons/TwimLogoWhite';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Loading() {
  const { resolvedTheme } = useTheme();
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  return (
    <div className='fixed mx-auto justiify-center items-center flex h-screen w-screen'>

      {theme === "dark" ? (
        <TwimLogoBlack className="svg-logo h-screen py-20 opacity-50 light:color-black" />
      ) : (
        <TwimLogoWhite className="h-screen py-20 opacity-50 light:color-black" />
      )}
    </div>
  );
}