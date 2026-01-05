import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { query } from './instance'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const showDevtools = false
  return (
    <>
      <QueryClientProvider client={query}>{children}</QueryClientProvider>
      {showDevtools && (
        <ReactQueryDevtools initialIsOpen={false} client={query} />
      )}
    </>
  )
}
