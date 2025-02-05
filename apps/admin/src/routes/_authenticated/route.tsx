import Cookies from 'js-cookie'
import {createFileRoute, Outlet, redirect} from '@tanstack/react-router'
import { cn } from '@admin/lib/utils'
import { SearchProvider } from '@admin/context/search-context'
import { SidebarProvider } from '@admin/components/ui/sidebar'
import { AppSidebar } from '@admin/components/layout/app-sidebar'
import SkipToMain from '@admin/components/skip-to-main'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context, location }) => {
    let shouldRedirect = false

    if (context.auth?.status === 'PENDING') {
      try {
        await context.auth.ensureData()
      }
      catch (_) {
        shouldRedirect = true
      }
    }

    if (context.auth?.status === 'UNAUTHENTICATED') {
      shouldRedirect = true
    }

    if (shouldRedirect) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'max-w-full w-full ml-auto',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] ease-linear duration-200',
            'h-svh flex flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}
