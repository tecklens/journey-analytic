
// Create a new router instance
import {createRouter} from "@tanstack/react-router";
import {AuthData} from "@admin/hooks/use-auth.ts";
import {routeTree} from "@admin/routeTree.gen.ts";
import {QueryClient} from "@tanstack/react-query";
import {queryClient} from "./query.ts";

type RouterContext = {
  auth: AuthData
  queryClient: QueryClient
}

const router = createRouter({
  routeTree,
  context: {
    auth: null as unknown as AuthData,
    queryClient
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})


declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export { router }
export type { RouterContext }