'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Juan [NOTE, 2025-02-27] Proveedor de tRPC para React
// Este proveedor está preparado pero no se utilizará hasta que se decida integrar tRPC
// Por ahora, solo usamos QueryClientProvider para evitar errores de TypeScript

// Cuando se decida integrar tRPC, descomentar este código:
/*
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../types/trpc';
import { TRPC_URL } from '../config';

// Juan [NOTE, 2025-02-27] Creación del cliente tRPC para React
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
  // Juan [NOTE, 2025-02-27] Este proveedor está preparado pero no se utilizará hasta que se decida integrar tRPC
  const [queryClient] = useState(() => new QueryClient(defaultQueryClientConfig));

  // Cuando se decida integrar tRPC, descomentar este código:
  /*
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: TRPC_URL,
          // Añadimos headers para autenticación si es necesario
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

  // Por ahora, solo usamos QueryClientProvider
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
