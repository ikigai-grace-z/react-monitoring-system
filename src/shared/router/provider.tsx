import { RouterProvider as Provider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { router } from './instance'

export function RouterProvider() {
  const showDevtools = false
  return (
    <>
      <Provider router={router} />
      {showDevtools && (
        <TanStackRouterDevtools initialIsOpen={false} router={router} />
      )}
    </>
  )
}
