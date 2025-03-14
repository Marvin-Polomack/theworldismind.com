"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TextAnimate } from "@/components/ui/misc/text-animate";
import ShinyButton from "@/components/ui/misc/shiny-button";
import { PowerGlitch } from 'powerglitch';
import localFont from 'next/font/local';
import { motion } from "framer-motion";

const GlitchDoctorFont = localFont({
  src: '../fonts/Doctor Glitch.otf',
  display: 'swap',
});

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    PowerGlitch.glitch('.glitch');
  }, []);

  const chatHandleClick = () => {
    router.push("/chat");
  };

  const storeHandleClick = () => {
    window.location.href = "https://store.theworldismind.com";
  };

  return (
    <div 
      className="relative overflow-hidden py-24 real-screen lg:py-32 flex items-center justify-center"
    >
      <div className="relative z-10 text-center">
        <div className="mx-auto">
          {/* Title */}
          <div>
            <motion.h1
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`glitch pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-none text-transparent dark:from-twimcolor dark:to-slate-900/10 ${GlitchDoctorFont.className}`}
            >
              The World Is Mind
            </motion.h1>
            <motion.h2
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className={`glitch pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-none text-transparent dark:from-twimcolor dark:to-slate-900/10 ${GlitchDoctorFont.className}`}
            >
              By Bolt
            </motion.h2>
            <TextAnimate
              animation="blurInUp"
              by="character"
              className="mt-5 text-lg text-twimcolor"
            >
              Nous avons tous Tort, la Raison elle, se trouve disséminée entre tous nos Torts.
            </TextAnimate>
          </div>
          {/* Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center">
            <ShinyButton onClick={chatHandleClick}>
              TWIM Chat
            </ShinyButton>
            <ShinyButton onClick={storeHandleClick}>
              TWIM Store
            </ShinyButton>
          </div>
        </div>
      </div>
      {/* GDPR Policy Link */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <a href="/gdpr" className="text-sm text-muted-foreground hover:underline">
          Politique de confidentialité
        </a>
      </div>
    </div>
  );
}