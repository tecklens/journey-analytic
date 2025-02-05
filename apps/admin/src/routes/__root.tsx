import {createRootRouteWithContext, Outlet} from '@tanstack/react-router'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'
import {Toaster} from '@admin/components/ui/toaster'
import GeneralError from '@admin/features/errors/general-error'
import NotFoundError from '@admin/features/errors/not-found-error'
import {RouterContext} from "@admin/lib/router.ts";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <>
        <Outlet />
        <Toaster />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
