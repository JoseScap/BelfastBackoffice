import { useState } from 'react';
import { trpcClient } from '../api/trpc/client';

export const StatusCheck = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Iniciando health check...');
      const healthResult = await trpcClient.status.ping.query();
      console.log('Respuesta del backend:', healthResult);
      setStatus(healthResult);
    } catch (err) {
      console.error('Error completo:', err);
      setError(
        'Error al conectar con el backend. Verifica que el servidor esté corriendo en el puerto 8080 y que la ruta /api/trpc esté disponible.'
      );
      setStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-2">
        <button
          onClick={checkStatus}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Checking...' : 'Check Backend Status'}
        </button>
        <div className="text-sm text-gray-600">
          Trying to connect to: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'}
          /api/trpc
        </div>
      </div>

      {status && (
        <div className="bg-green-50 p-4 rounded">
          <h3 className="font-bold text-green-800">Health Check:</h3>
          <p className="text-green-600">{status}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 p-4 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};
