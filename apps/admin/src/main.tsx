import {StrictMode} from 'react'
import ReactDOM from 'react-dom/client'
import {QueryClientProvider,} from '@tanstack/react-query'
import {RouterProvider} from '@tanstack/react-router'
import {ThemeProvider} from './context/theme-context'
import './index.css'
import {router} from "@admin/lib/router.ts";
import {queryClient} from "@admin/lib/query.ts";

// Render the app
// @ts-ignore
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
