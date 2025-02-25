// https://ground.bossadizenith.me/docs/components/inputs/password-strength
"use client";

import { motion, useAnimationControls } from "framer-motion";
import React, { useState, useEffect } from "react";
import { LucideEye, LucideEyeOff } from "lucide-react";
import { cn } from "@/utils/cn";
import { z } from "zod";

interface PasswordStrengthProps {
  onStrengthChange?: (progress: number) => void;
}

// Zod schema for password validation, now including uppercase letter check
const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères")
  .regex(/[a-zA-Z]/, "Le mot de passe doit contenir au moins une lettre")
  .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une lettre majuscule")
  .regex(/\d/, "Le mot de passe doit contenir au moins un chiffre")
  .regex(/[\W_]/, "Le mot de passe doit contenir au moins un caractère spécial");

const PasswordStrength = ({ onStrengthChange }: PasswordStrengthProps) => {
  const [value, setValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [validationProgress, setValidationProgress] = useState(0); // Track validation progress
  const [hasScaled, setHasScaled] = useState(false); // To track if scaling has already occurred
  const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
  const scaleControls = useAnimationControls();

  const getBackgroundColor = (progress: number) => {
    // Background colors change as validation progresses
    if (progress === 0) return "#ffcccb"; // Red for invalid
    if (progress < 100) return "#ffa07a"; // Orange for partial validation
    return "#32cd32"; // Green for full validation
  };

  useEffect(() => {
    const checks = {
      length: false,
      letter: false,
      uppercase: false,
      number: false,
      special: false,
    };

    // Check each zod validation condition independently
    if (value.length >= 8) checks.length = true;
    if (/[a-zA-Z]/.test(value)) checks.letter = true;
    if (/[A-Z]/.test(value)) checks.uppercase = true; // Uppercase check
    if (/\d/.test(value)) checks.number = true;
    if (/[\W_]/.test(value)) checks.special = true;

    // Calculate validation progress based on how many checks pass
    const progress =
      (Object.values(checks).filter((pass) => pass).length / 5) * 100;
    setValidationProgress(progress);
    if (onStrengthChange) onStrengthChange(progress);

    // Set error if not fully valid
    try {
      passwordSchema.parse(value);
      setValidationError(null); // Clear error if valid
    } catch (err: any) {
      setValidationError(err.errors[0].message); // Set error message if invalid
    }

    // Trigger scaling only once when validation reaches 100%
    if (progress === 100 && !hasScaled) {
      scaleControls.start({
        scale: [1, 0.9, 1.1, 1],
        transition: { duration: 0.5 },
      });
      setHasScaled(true); // Mark as scaled to prevent repeated scaling
    }
  }, [value, scaleControls, hasScaled, onStrengthChange]);

  return (
    <div className="h-full w-full center">
      <motion.div
        layout
        transition={{ duration: 0.1, ease: "easeInOut" }}
        className="max-w-lg mx-auto w-full center flex-col gap-4"
      >
        <motion.div
          animate={scaleControls}
          className="w-full h-20 rounded-lg bg-muted p-2 relative z-0 overflow-hidden"
        >
          <div className="h-full m-auto w-full bg-primary rounded-lg overflow-hidden">
            <input
              onChange={(e) => {
                setValue(e.target.value);
                if (validationProgress < 100) setHasScaled(false); // Reset scaling when progress drops below 100%
              }}
              placeholder="Mot de passe"
              type={showPassword ? "text" : "password"}
              className="h-full w-full outline-none border-none px-5 pr-12 z-10 text-muted-foreground"
            />
            <button
              type="button"
              className="my-auto absolute right-5 top-0 bottom-0 size-10 center border rounded"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <LucideEye
                  onClick={() => setShowPassword(false)} // Hide password
                  className="m-auto size-4 cursor-pointer text-muted-foreground pointer-events-none"
                />
              ) : (
                <LucideEyeOff
                  onClick={() => setShowPassword(true)} // Show password
                  className="m-auto size-4 cursor-pointer text-muted-foreground pointer-events-none"
                />
              )}
            </button>
            <motion.div
              style={{
                background: getBackgroundColor(validationProgress), // Dynamic background based on validation progress
              }}
              animate={{ width: `${validationProgress}%` }} // Width increases with validation progress
              className={cn(`absolute top-0 left-0 h-full -z-10`)}
            />
          </div>
        </motion.div>
        {validationError && value.length !== 0 && (
          <p className="text-red-500 text-sm mt-2">{validationError}</p>
        )}
      </motion.div>
    </div>
  );
};

export default PasswordStrength;
