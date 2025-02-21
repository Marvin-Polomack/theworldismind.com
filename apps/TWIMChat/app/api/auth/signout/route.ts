import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  // Create a Supabase client using the auth helpers and Next.js cookies
  const supabase = await createClient();

  // Call Supabase's signOut method to end the user session
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
  
  // Redirect to the homepage after successful sign-out
  return NextResponse.redirect(new URL("/", request.url));
}