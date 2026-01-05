import { createFileRoute, Navigate } from '@tanstack/react-router'

type Search = {
  cardId?: string
}
export const Route = createFileRoute('/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): Search => {
    return {
      cardId: typeof search.cardId === 'string' ? search.cardId : undefined,
    }
  },
})

function RouteComponent() {
  return <Navigate replace to="/live-stream" />
}
