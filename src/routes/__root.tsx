import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'

import { QueryProvider } from '@/shared/query/provider'

import { LayoutWrapper } from '@/features/layout/layout-wrapper'
// import { ServiceWorkerProvider } from '@/shared/service-worker/provider'
// import { ReloadPrompt } from '@/shared/service-worker/reload-prompt'
import { PageError } from '@/features/page-exception/page-error'
import { PageNotFound } from '@/features/page-exception/page-not-found'
import { PagePending } from '@/features/page-exception/page-pending'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  errorComponent: PageError,
  notFoundComponent: PageNotFound,
  pendingComponent: PagePending,
})

function RootComponent() {
  return (
    <QueryProvider>
      <LayoutWrapper>
        <Outlet />
      </LayoutWrapper>
    </QueryProvider>
  )
}
