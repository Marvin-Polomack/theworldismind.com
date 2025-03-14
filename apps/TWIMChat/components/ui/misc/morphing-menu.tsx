"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface MorphingMenuProps {
  className?: string;
  links: {
    href: string;
    label: string;
  }[];
}

export function MorphingMenu({ className, links }: MorphingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const mouseY = useMotionValue(0);
  const mouseX = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-3 hover:opacity-75 transition-opacity text-primary",
          className
        )}
        aria-label="Toggle menu"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "close" : "menu"}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </motion.div>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            />

            {/* Menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ 
                x: 0,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }
              }}
              exit={{ 
                x: "-100%",
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }
              }}
              className="fixed top-0 left-0 z-50 h-full w-[300px] overflow-hidden"
            >
              {/* Shiny border and background */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background">
                <div className="absolute inset-[1px] bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 backdrop-blur-xl" />
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shine-animated" />
                {/* Stars background */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-px h-px bg-white rounded-full animate-twinkle"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Menu content */}
              <nav className="relative p-6 pt-20 space-y-4">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: {
                        delay: 0.1 + index * 0.1
                      }
                    }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Link
                      href={link.href}
                      className="block p-3 text-lg transition-all rounded-md 
                        text-white/90 hover:text-white
                        bg-white/5 hover:bg-white/10
                        border border-white/10 hover:border-white/20
                        backdrop-blur-sm
                        shadow-[0_0_15px_rgba(0,0,0,0.2)]
                        hover:shadow-[0_0_25px_rgba(0,0,0,0.3)]"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}