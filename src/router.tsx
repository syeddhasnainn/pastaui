import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const isShellPath = (pathname: string) => pathname !== '/'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultViewTransition: {
      types: ({ fromLocation, toLocation, pathChanged }) => {
        if (!pathChanged) return false
        if (
          fromLocation &&
          isShellPath(fromLocation.pathname) &&
          isShellPath(toLocation.pathname)
        ) {
          return false
        }
        return ['page']
      },
    },
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
