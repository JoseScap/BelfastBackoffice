'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Juan [TOIMPLE, 2025-02-27] Integrar completamente tRPC cuando se decida usar en producción
// Descomentar el código comentado y eliminar el cliente mock

import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../types/trpc';
import { TRPC_URL } from '../config';

// Creamos el cliente tRPC para React
// Este cliente se usará para hacer peticiones al backend desde componentes React
export const trpc = createTRPCReact<AppRouter>();

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

// Exportamos un objeto vacío para evitar errores de compilación
// Este objeto se reemplazará por el cliente tRPC real cuando se implemente
export const trpcReact = {
  Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
};

// Juan [NOTE, 2025-02-27] Proveedor de tRPC para React
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(defaultQueryClientConfig));

  // Por ahora, solo usamos el QueryClientProvider
  // La integración completa con tRPC se hará más adelante
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
