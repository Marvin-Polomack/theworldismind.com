'use client';

import { Button } from '@/components/ui/Button/button';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from "lucide-react";
import PasswordStrength from '../ui/input/PasswordStrength';
import { toast } from "sonner";

interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const searchParams = useSearchParams();
  const errorTittle = searchParams.get('error');
  const errorMessage = searchParams.get('error_description');

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorTittle, {
        description: errorMessage,
        duration: 5000,
        position: "top-right"
      });
    }
  }, [errorMessage]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await handleRequest(e, signUp, router);
    setIsSubmitting(false);
  };

  const redirectTo = searchParams.get('redirect');

  return (
    <div className="my-8">
      <form noValidate className="mb-4" onSubmit={(e) => handleSubmit(e)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              placeholder="nom@exemple.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
            <label htmlFor="password">Mot de passe</label>
            <PasswordStrength onStrengthChange={setPasswordStrength} />
          </div>
          <Button
            variant="default"
            type="submit"
            className="mt-1"
            disabled={isSubmitting || passwordStrength < 100}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inscription en cours...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>
          <p className="text-xs text-center text-gray-500 mt-2">
            En créant un compte, vous acceptez notre politique de confidentialité (<Link href="/gdpr" className="underline">ici</Link>).
          </p>
        </div>
      </form>
      <p>Vous avez déjà un compte ?</p>
      <p>
        <Link href="/signin/password_signin" className="font-light text-sm hover:underline">
          Connectez-vous avec votre e-mail et mot de passe
        </Link>
      </p>
      {allowEmail && (
        <p>
          <Link href="/signin/email_signin" className="font-light text-sm hover:underline">
            Connectez-vous via un lien magique
          </Link>
        </p>
      )}
    </div>
  );
}