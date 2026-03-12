import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { ThemeProvider } from './context/theme-provider'
import { ErrorBoundary } from './components/error-boundary'
import { routeTree } from './routeTree.gen'
import { queryClient } from './lib/query-client'



const router = createRouter({
  routeTree,
  context: { queryClient },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // You can log to an error reporting service here
        // eslint-disable-next-line no-console
        console.error('Application error:', error, errorInfo)
      }}
    >

      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App

