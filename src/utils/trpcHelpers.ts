import toast from 'react-hot-toast';
import { mockTrpcClient, trpcClient } from '@/api/trpc/client';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from '@/types/trpc';
import { TRPC_URL } from '@/api/config';

/**
 * Ejecuta una llamada a la API de tRPC con manejo de errores
 * @param apiCall Función que realiza la llamada a la API
 * @param errorMessage Mensaje de error personalizado
 * @returns El resultado de la llamada a la API o null en caso de error
 */
export async function trpcSafeCall<T>(
  apiCall: () => Promise<T>,
  errorMessage: string = 'Error en la llamada a la API'
): Promise<T | null> {
  try {
    return await apiCall();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    toast.error(errorMessage);
    return null;
  }
}

/**
 * Verifica si el backend está disponible
 * @returns true si el backend está disponible, false en caso contrario
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    // Creamos un cliente tRPC sin autenticación para verificar la disponibilidad
    const noAuthClient = createTRPCProxyClient<AppRouter>({
      links: [
        httpBatchLink({
          url: TRPC_URL,
          // No enviamos encabezados de autenticación
          headers: () => ({}),
        }),
      ],
    });

    // Usamos el cliente sin autenticación para verificar la disponibilidad
    // Usamos any para evitar errores de tipo
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = noAuthClient as any;

    try {
      // Intentamos usar el endpoint ping
      const response = await client.status.ping.query();
      return response === 'pong';
    } catch {
      // Si falla, intentamos usar el endpoint health como fallback
      try {
        const response = await client.status.health.query();
        return response.status === 'ok';
      } catch {
        // Si ambos fallan, el backend no está disponible
        return false;
      }
    }
  } catch (error) {
    console.error('Error al verificar la disponibilidad del backend:', error);
    return false;
  }
}

/**
 * Crea un cliente tRPC sin autenticación
 * @returns Un cliente tRPC sin autenticación
 */
export function createNoAuthClient(): typeof trpcClient {
  return createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: TRPC_URL,
        // No enviamos encabezados de autenticación
        headers: () => ({}),
      }),
    ],
  });
}

/**
 * Verifica si un endpoint requiere autenticación
 * Para simplificar el desarrollo, consideramos que ningún endpoint requiere autenticación por ahora
 * @returns false - Ningún endpoint requiere autenticación por ahora
 */
export function requiresAuth(): boolean {
  // Para simplificar el desarrollo, consideramos que ningún endpoint requiere autenticación por ahora
  // Esto nos permitirá probar la integración sin preocuparnos por la autenticación
  return false;
}

/**
 * Obtiene el cliente tRPC adecuado según la disponibilidad del backend
 * @param forceMock Indica si se debe usar el cliente mock independientemente de la disponibilidad del backend
 * @returns El cliente tRPC adecuado
 */
export async function getTrpcClient(
  forceMock: boolean = false
): Promise<typeof trpcClient | typeof mockTrpcClient> {
  if (forceMock) {
    return mockTrpcClient;
  }

  const isAvailable = await isBackendAvailable();
  return isAvailable ? trpcClient : mockTrpcClient;
}
