import { createRouter } from '@tanstack/react-router'

import { query } from '@/shared/query/instance'

import { routeTree } from '@/routeTree.gen'

// Create a new router instance
export const router = createRouter({
  context: {
    queryClient: query,
  },
  routeTree,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
