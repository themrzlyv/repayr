import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/loans')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/loans"!</div>
}
