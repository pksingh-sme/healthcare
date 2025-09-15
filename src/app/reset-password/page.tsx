import { default as dynamic } from 'next/dynamic'

const ResetPasswordClient = dynamic(() => import('@/components/auth/ResetPasswordClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  )
})

export default function ResetPasswordPage() {
  return <ResetPasswordClient />
}