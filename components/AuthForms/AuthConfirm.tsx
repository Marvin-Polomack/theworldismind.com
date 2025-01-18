"use client";

import TwimLogoBlack from '@/components/icons/TwimLogoBlack';
import { useRouter, useSearchParams } from 'next/navigation'
import MagicCard from "@/components/ui/MagicCard";
import { InputOTPForm } from "@/components/ui/OtpForm/InputOtpForm";

export default function AuthConfirm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleConfirm = () => {
    router.push(`/api/auth/confirm?token=${searchParams.get("token_hash")}&type=${searchParams.get("type")}`)
  }

  return (
    <div className="flex flex-col justify-between max-w-lg p-3 m-auto">
      <MagicCard
        title='Confirme ton adresse email'
        className='py-6 flex flex-col items-center m-auto justify-center'
      >
        <div className="flex flex-col gap-4">
          <TwimLogoBlack width="96px" height="96px" className="mx-auto mt-5" />
          <div className="flex flex-col items-center justify-center">
            {searchParams.get("type") === "email" ? (  
              <InputOTPForm  /> 
            ) : ( 
              <InputOTPForm  />
            )
            }
          </div>
        </div>
      </MagicCard>
    </div>
  )
}