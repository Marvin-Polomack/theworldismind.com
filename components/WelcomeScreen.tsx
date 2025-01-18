"use client";

import { useTheme } from "next-themes";
// import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import FlipText from "@/components/ui/flip-text";
import { TextAnimate } from "@/components/ui/text-animate";
import ShinyButton from "@/components/ui/shiny-button";

export default function WelcomeScreen() {
  const router = useRouter();

  const chatHandleClick = () => {
    // Redirect to dashboard or main app area
    router.push("/chat");
  }

  return (
    <>
      <div className="relative overflow-hidden py-24 lg:py-32 min-h-screen flex items-center justify-center">
        < div className="relative z-10 text-center">
          <div className="mx-auto">
            {/* <img
              src="/images/twim-logo.png"
              alt="logo"
              className="h-96 mx-auto opacity-70"
            /> */}
            {/* Title */}
            <div className="">
              <FlipText className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
                word="The World Is Mind"
              />
              <FlipText className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-lg sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
                word="By Bolt"
              />
              <TextAnimate animation="blurInUp" by="character" className="mt-5 text-lg text-muted-foreground">
                Nous avous tous Tort, la Raison elle, se trouve disséminée entre tous nos Torts.
              </TextAnimate>
            </div>
            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center">
              <ShinyButton
                onClick={chatHandleClick}
              >
                TWIM Chat
              </ShinyButton>
              <ShinyButton>
                Learn more
              </ShinyButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
