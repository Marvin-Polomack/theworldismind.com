import { redirect } from 'next/navigation'
import AuthConfirm from '@/components/AuthForms/AuthConfirm'

export default function ConfirmPage() {

  return (
    <div className="m-auto flex flex-col items-center justify-center h-screen">
      <AuthConfirm />
    </div>
  )
}
