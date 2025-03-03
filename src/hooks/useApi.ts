import { useState } from 'react';
import { trpcClient } from '../api/trpc';

// Juan [TOIMPLE, 2025-02-27] Completar la implementación del hook cuando se integre tRPC
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Función genérica para realizar peticiones a la API
  const apiRequest = async <T>(
    requestFn: () => Promise<T>,
    errorMessage = 'Error en la petición a la API'
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      console.error(errorMessage, err);
      setError(err instanceof Error ? err : new Error(errorMessage));
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Verificar el estado del backend
  const checkHealth = () => {
    return apiRequest(
      () => trpcClient.status.health.query(),
      'Error al verificar el estado del backend'
    );
  };

  // Autenticación
  const login = (email: string) => {
    return apiRequest(() => trpcClient.auth.login.mutate({ email }), 'Error al iniciar sesión');
  };

  // Juan [TOIMPLE, 2025-02-27] Implementar registro con contraseña cuando se integre tRPC
  const register = (fullName: string, email: string) => {
    return apiRequest(
      () => trpcClient.auth.register.mutate({ fullName, email }),
      'Error al registrar usuario'
    );
  };

  const getProfile = () => {
    return apiRequest(() => trpcClient.auth.profile.query(), 'Error al obtener perfil de usuario');
  };

  return {
    loading,
    error,
    checkHealth,
    login,
    register,
    getProfile,
    // Juan [TOIMPLE, 2025-02-27] Añadir más métodos para otras entidades (hoteles, habitaciones, etc.)
  };
}
