"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import ShinyButton from "@/components/ui/misc/shiny-button";

import { toast } from "@/hooks/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/misc/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/misc/input-otp"
import { useRouter, useSearchParams } from "next/navigation"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Le code doit contenir au moins 6 caractères.",
  }),
})

export function InputOTPForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "Vous avez rentré ce code:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    if (searchParams.get("email")) {
      router.push(`/api/auth/confirm?email=${searchParams.get("email")}&token=${data.pin}&type=${searchParams.get("type")}`)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation de mon adresse email</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Entre le code à 6 chiffres que tu as reçu par email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

          <ShinyButton
            type="submit"
          >
            Confirmer mon adresse email
          </ShinyButton>
      </form>
    </Form>
  )
}
