'use client';

import { useState, useCallback, useEffect } from 'react';
import { trpcClient } from '@/api/trpc/client';
import { RoomStatus } from '@/types/hotel';
import toast from 'react-hot-toast';
import { isBackendAvailable, trpcSafeCall, createNoAuthClient } from '@/utils/trpcHelpers';
import { ApiStructure } from '@/types/trpc';

interface UseRoomStatusReturn {
  roomStatuses: RoomStatus[];
  loading: boolean;
  error: string | null;
  fetchRoomStatuses: () => Promise<void>;
  isBackendConnected: boolean;
}

export const useRoomStatus = (): UseRoomStatusReturn => {
  const [roomStatuses, setRoomStatuses] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  // Verificar la disponibilidad del backend al montar el componente
  useEffect(() => {
    const checkBackendAvailability = async () => {
      const available = await isBackendAvailable();
      setIsBackendConnected(available);
      if (!available) {
        console.warn('Backend no disponible, usando datos mock');
      }
    };

    checkBackendAvailability();
  }, []);

  const fetchRoomStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Intentar usar el cliente real, con fallback al mock
      let response;
      if (isBackendConnected) {
        // Siempre usamos el cliente sin autenticación para simplificar
        const client = createNoAuthClient() as unknown as ApiStructure;

        response = await trpcSafeCall(
          () => client.roomStatus.getAll.query(),
          'Error al cargar los estados de habitaciones'
        );
      }

      // Si no hay respuesta del backend o no está conectado, usar datos mock
      if (!response) {
        console.warn('Usando datos mock para estados de habitaciones');
        // Aquí usaríamos el cliente mock, pero como no queremos modificar la UI,
        // simplemente no hacemos nada y dejamos que la UI siga usando los datos mock
        setLoading(false);
        return;
      }

      // Transformar la respuesta del backend al formato esperado por el frontend
      // Aseguramos que response sea un array para evitar errores
      const responseArray = Array.isArray(response) ? response : [];
      const transformedStatuses = responseArray.map((status: any) => ({
        id: status.id || '',
        description: status.description || '',
        value: status.value || 'Disponible',
      }));

      setRoomStatuses(transformedStatuses);
    } catch (err) {
      console.error('Error fetching room statuses:', err);
      setError('Error al cargar los estados de habitaciones');
      toast.error('Error al cargar los estados de habitaciones');
    } finally {
      setLoading(false);
    }
  }, [isBackendConnected]);

  return {
    roomStatuses,
    loading,
    error,
    fetchRoomStatuses,
    isBackendConnected,
  };
};
