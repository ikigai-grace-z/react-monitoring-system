import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/vod')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className="w-full p-4">no videos yet</div>
}
