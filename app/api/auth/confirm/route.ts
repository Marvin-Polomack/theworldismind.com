import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token') as string
  const type = searchParams.get('type') as EmailOtpType | null
  const email = searchParams.get('email') as string
  const next = searchParams.get('next') ?? '/'

  if (token && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    })
    if (!error) {
      redirect(next)
    }
    // Return error response if verification fails
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Return error response for missing parameters
  return new Response(JSON.stringify({ error: 'Missing token_hash or type parameter' }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}