import { redirect } from 'next/navigation';
import { getDefaultSignInView } from '@/utils/auth-helpers/settings';
import { cookies } from 'next/headers';

export default async function SignIn({ searchParams }: { searchParams: Promise<{redirect: string }> }) {
  const cookieStore = await cookies();
  const preferredSignInView =
    cookieStore.get('preferredSignInView')?.value || null;
  const defaultView = getDefaultSignInView(preferredSignInView);
  const { redirect: redirectTo } = await searchParams;

  if (redirectTo) {
    return redirect(`/signin/${defaultView}?redirect=${redirectTo}`);
  } else {
    return redirect(`/signin/${defaultView}`);
  }
}