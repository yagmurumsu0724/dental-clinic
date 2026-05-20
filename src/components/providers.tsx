'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'
import { handleQueryError } from '@/lib/errors'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Sayfadan ayrılıp geri döndüğünde stale verileri refetch et
            refetchOnWindowFocus: true,
            // Network hatalarında 2 kez yeniden dene
            retry: (failureCount, error) => {
              // 401/404 hataları için retry etme
              if (error instanceof Error && error.message.includes('404')) return false
              if (error instanceof Error && error.message.includes('yetki')) return false
              return failureCount < 2
            },
            staleTime: 1000 * 60, // 1 dakika varsayılan
          },
          mutations: {
            onError: (error) => {
              // Global mutation error — her mutation kendi toast'ını yönetir
              console.error('[Mutation Error]', handleQueryError(error))
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  )
}
