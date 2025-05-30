import { SignInPage } from '@/app/modules/auth/interface/ui/sign-in/sign-in.page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignInPage />
}
