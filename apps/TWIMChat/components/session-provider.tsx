"use client"

import * as React from "react"
import { SessionProvider  } from "next-auth/react"

//Wraps the Next.js SessionProvider component and passes along the provided props. This allows the application to use the session management functionality provided by Next.Auth.
export function Session({
  children,
  ...props
}: React.ComponentProps<typeof SessionProvider>) {
  return <SessionProvider {...props}>{children}</SessionProvider>
}