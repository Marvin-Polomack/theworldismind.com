'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL, getErrorRedirect, getStatusRedirect } from '@/utils/helpers';
import { getAuthTypes } from '@/utils/auth-helpers/settings';

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(formData: FormData) {
  const pathName = String(formData.get('pathName')).trim();

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return getErrorRedirect(
      pathName,
      "Hmm... Quelque chose s'est mal passé.",
      "Impossible de vous déconnecter."
    );
  }

  return '/signin';
}

export async function signInWithEmail(formData: FormData) {
  const cookieStore = await cookies();
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      'Adresse e-mail invalide.',
      'Veuillez réessayer.'
    );
  }

  const supabase = await createClient();
  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      "Impossible de vous connecter.",
      error.message
    );
  } else if (data) {
    cookieStore.set('preferredSignInView', 'email_signin', { path: '/' });
    redirectPath = getStatusRedirect(
      '/signin/email_signin',
      'Succès !',
      "Veuillez vérifier votre e-mail pour un lien magique. Vous pouvez maintenant fermer cet onglet.",
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/email_signin',
      "Hmm... Quelque chose s'est mal passé.",
      "Impossible de vous connecter."
    );
  }

  return redirectPath;
}

export async function requestPasswordUpdate(formData: FormData) {
  const callbackURL = getURL('/auth/reset_password');

  // Get form data
  const email = String(formData.get('email')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      'Adresse e-mail invalide.',
      'Veuillez réessayer.'
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      error.message,
      'Veuillez réessayer.'
    );
  } else if (data) {
    redirectPath = getStatusRedirect(
      '/signin/forgot_password',
      'Succès !',
      "Veuillez vérifier votre e-mail pour un lien de réinitialisation du mot de passe. Vous pouvez maintenant fermer cet onglet.",
      true
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password',
      "Hmm... Quelque chose s'est mal passé.",
      "L'e-mail de réinitialisation du mot de passe n'a pas pu être envoyé."
    );
  }

  return redirectPath;
}

export async function signInWithPassword(formData: FormData) {
  const cookieStore = await cookies();
  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      'Échec de la connexion.',
      error.message
    );
  } else if (data.user) {
    cookieStore.set('preferredSignInView', 'password_signin', { path: '/' });
    redirectPath = getStatusRedirect('/', 'Succès !', 'Vous êtes maintenant connecté.');
  } else {
    redirectPath = getErrorRedirect(
      '/signin/password_signin',
      "Hmm... Quelque chose s'est mal passé.",
      "Impossible de vous connecter."
    );
  }

  return redirectPath;
}

export async function signUp(formData: FormData) {
  const callbackURL = getURL('/auth/callback');

  const email = String(formData.get('email')).trim();
  const password = String(formData.get('password')).trim();
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Adresse e-mail invalide.',
      'Veuillez réessayer.'
    );
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL
    }
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Création de compte impossible.',
      error.message
    );
  } else if (data.session) {
    redirectPath = getStatusRedirect('/', 'Succès !', 'Vous êtes maintenant connecté.');
  } else if (
    data.user &&
    data.user.identities &&
    data.user.identities.length == 0
  ) {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      'Création de compte impossible.',
      'Un compte existe déjà avec cette adresse email.'
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Succès !',
      "Veuillez vérifier votre e-mail pour un lien de confirmation. Vous pouvez maintenant fermer cet onglet."
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/signup',
      "Hmm... Quelque chose s'est mal passé.",
      "Impossible de vous inscrire."
    );
  }

  return redirectPath;
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password')).trim();
  const passwordConfirm = String(formData.get('passwordConfirm')).trim();
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      "Votre mot de passe n'a pas pu être mis à jour.",
      'Les mots de passe ne correspondent pas.'
    );
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      "Votre mot de passe n'a pas pu être mis à jour.",
      error.message
    );
  } else if (data.user) {
    redirectPath = getStatusRedirect(
      '/',
      'Succès !',
      'Votre mot de passe a été mis à jour.'
    );
  } else {
    redirectPath = getErrorRedirect(
      '/signin/update_password',
      "Hmm... Quelque chose s'est mal passé.",
      "Votre mot de passe n'a pas pu être mis à jour."
    );
  }

  return redirectPath;
}

export async function updateEmail(formData: FormData) {
  // Get form data
  const newEmail = String(formData.get('newEmail')).trim();

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect(
      '/account',
      "Votre e-mail n'a pas pu être mis à jour.",
      'Adresse e-mail invalide.'
    );
  }

  const supabase = await createClient();

  const callbackUrl = getURL(
    getStatusRedirect('/account', 'Succès !', 'Votre e-mail a été mis à jour.')
  );

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl
    }
  );

  if (error) {
    return getErrorRedirect(
      '/account',
      "Votre e-mail n'a pas pu être mis à jour.",
      error.message
    );
  } else {
    return getStatusRedirect(
      '/account',
      'Des e-mails de confirmation ont été envoyés.',
      'Vous devrez confirmer la mise à jour en cliquant sur les liens envoyés à la fois à l\'ancienne et à la nouvelle adresse e-mail.'
    );
  }
}

export async function updateName(formData: FormData) {
  // Get form data
  const fullName = String(formData.get('fullName')).trim();

  const supabase = await createClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return getErrorRedirect(
      '/account',
      "Votre nom n'a pas pu être mis à jour.",
      error.message
    );
  } else if (data.user) {
    return getStatusRedirect(
      '/account',
      'Succès !',
      'Votre nom a été mis à jour.'
    );
  } else {
    return getErrorRedirect(
      '/account',
      "Hmm... Quelque chose s'est mal passé.",
      "Votre nom n'a pas pu être mis à jour."
    );
  }
}