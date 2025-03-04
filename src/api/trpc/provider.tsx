'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Juan [TOIMPLE, 2025-02-27] Integrar completamente tRPC cuando se decida usar en producción
// Descomentar el código comentado y eliminar el cliente mock

/*
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../types/trpc';
import { TRPC_URL } from '../config';

export const trpc = createTRPCReact<AppRouter>();
*/

// Cliente tRPC mock para desarrollo
export const trpc = {} as {
  createClient: () => unknown;
  Provider: React.FC<{ children: React.ReactNode; client: unknown; queryClient: unknown }>;
};

// Configuración por defecto para el QueryClient
const defaultQueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // No recargar datos al cambiar de pestaña
      retry: 1, // Solo reintentar una vez en caso de error
      staleTime: 5 * 60 * 1000, // 5 minutos antes de considerar los datos obsoletos
      cacheTime: 10 * 60 * 1000, // 10 minutos de caché
    },
    mutations: {
      retry: 1, // Solo reintentar una vez en caso de error
    },
  },
};

// Juan [NOTE, 2025-02-27] Proveedor de tRPC para React
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(defaultQueryClientConfig));

  // Juan [TOIMPLE, 2025-02-27] Implementar el proveedor real de tRPC
  /*
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: TRPC_URL,
          headers: () => {
            const token =
              typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
            return {
              Authorization: token ? `Bearer ${token}` : '',
            };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
  */

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
