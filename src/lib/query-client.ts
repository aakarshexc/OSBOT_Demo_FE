import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
        mutations: {
            onError: (error) => {
                // eslint-disable-next-line no-console
                console.error('Mutation error:', error)
            },
        },
    },
})
