'use client';

import { useState } from 'react';
import { mockTrpcClient } from '../api/trpc/client';

// Juan [NOTE, 2025-02-27] Componente de prueba para verificar la conexión con el backend
// Este componente está preparado pero no se utilizará hasta que se decida integrar tRPC
export default function ApiTest() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      // Llamada a la API usando tRPC
      const result = await mockTrpcClient.status.ping.query();
      setStatus(result);
    } catch (err) {
      console.error('Error al verificar el estado del backend:', err);
      setError('Error al conectar con el backend. Verifica la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Estado del Backend</h2>
      <button
        onClick={checkStatus}
        disabled={loading}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
      >
        {loading ? 'Verificando...' : 'Verificar Conexión'}
      </button>

      {status && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
          <p>Estado: {status}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Nota: Este componente está preparado para probar la conexión con el backend usando tRPC,
          pero no se utilizará hasta que se decida integrar completamente tRPC.
        </p>
      </div>
    </div>
  );
}
