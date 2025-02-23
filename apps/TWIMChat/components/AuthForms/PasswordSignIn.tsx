'use client';

import { Button } from '@/components/ui/Button/button';
import Link from 'next/link';
import { signInWithPassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Loader2 } from "lucide-react";

interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod
}: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = searchParams.get('redirect');
  const redirectLink = redirectTo ? `/signin/signup?redirect=${redirectTo}` : `/signin/signup`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    await handleRequest(e, signInWithPassword, router, redirectTo);
    setIsSubmitting(false);
  };

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
            <input
              id="password"
              placeholder="Mot de passe"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
          </div>
          <Button
            variant="default"
            type="submit"
            className="mt-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
          <p className="text-xs text-gray-500">
            Pour consulter notre politique de confidentialité, cliquez <Link href="/gdpr" className="underline">ici</Link>.
          </p>
        </div>
      </form>
      <p>
        <Link href="/signin/forgot_password" className="font-light text-sm hover:underline">
          Mot de passe oublié ?
        </Link>
      </p>
      {allowEmail && (
        <p>
          <Link href="/signin/email_signin" className="font-light text-sm hover:underline">
            Se connecter via lien magique
          </Link>
        </p>
      )}
      <p>
        <Link href={redirectLink} className="font-light text-sm hover:underline">
          Vous n'avez pas de compte ? Inscrivez-vous
        </Link>
      </p>
    </div>
  );
}