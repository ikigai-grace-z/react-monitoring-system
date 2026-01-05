import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'

export const query = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error.message)
    },
  }),
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error.message)
    },
  }),
})
