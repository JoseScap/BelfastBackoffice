'use client';

import { useEffect, useState } from 'react';
import { mockTrpcClient } from '../api/trpc/client';

// Juan [NOTE, 2025-02-27] Componente para mostrar el estado del backend
// Este componente está preparado pero no se utilizará hasta que se decida integrar tRPC
export default function BackendStatus() {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Llamada a la API usando tRPC
        await mockTrpcClient.status.ping.query();
        setStatus('online');
      } catch (error) {
        console.error('Error al verificar el estado del backend:', error);
        setStatus('offline');
      }
    };

    checkBackendStatus();
    // Verificar el estado cada 30 segundos
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center">
      <span className="mr-2">Backend:</span>
      {status === 'checking' && (
        <span className="flex items-center">
          <span className="h-2 w-2 bg-yellow-500 rounded-full mr-1"></span>
          Verificando...
        </span>
      )}
      {status === 'online' && (
        <span className="flex items-center">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
          Online
        </span>
      )}
      {status === 'offline' && (
        <span className="flex items-center">
          <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
          Offline
        </span>
      )}
    </div>
  );
}
