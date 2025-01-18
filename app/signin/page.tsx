import { redirect } from 'next/navigation';
import { getDefaultSignInView } from '@/utils/auth-helpers/settings';
import { cookies } from 'next/headers';

export default async function SignIn({ searchParams }: { searchParams: { redirect: string } }) {
  const cookieStore = await cookies();
  const preferredSignInView =
    cookieStore.get('preferredSignInView')?.value || null;
  const defaultView = getDefaultSignInView(preferredSignInView);
  
  // Get the query parameters from the context
  const redirectTo = (await searchParams).redirect;

  if (redirectTo) {
    return redirect(`/signin/${defaultView}?redirect=${redirectTo}`);
  } else {
    return redirect(`/signin/${defaultView}`);
  }
}