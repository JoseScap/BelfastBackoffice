'use client';

import React, { useEffect, useState } from 'react';
import { isBackendAvailable } from '@/utils/trpcHelpers';
import toast from 'react-hot-toast';

/**
 * Componente que muestra el estado de la conexión con el backend
 * Este componente es solo para desarrollo y debugging
 */
export const BackendConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      try {
        const available = await isBackendAvailable();
        setIsConnected(available);
        if (available) {
          console.log('✅ Conexión con el backend establecida correctamente');
        } else {
          console.warn('⚠️ No se pudo conectar con el backend, usando datos mock');
        }
      } catch (error) {
        console.error('Error al verificar la conexión con el backend:', error);
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
  }, []);

  // Este componente no renderiza nada visible, solo muestra mensajes en la consola
  // y notificaciones toast para informar sobre el estado de la conexión
  useEffect(() => {
    if (isConnected === true) {
      toast.success('Conexión con el backend establecida', {
        id: 'backend-connection',
        duration: 3000,
      });
    } else if (isConnected === false) {
      toast.error('No se pudo conectar con el backend, usando datos mock', {
        id: 'backend-connection',
        duration: 5000,
      });
    }
  }, [isConnected]);

  return null; // No renderiza nada visible
};

export default BackendConnectionStatus;
