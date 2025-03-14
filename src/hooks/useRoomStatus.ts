import { useState, useCallback } from 'react';
import { trpcClient } from '@/api/trpc';
import { RoomStatusResponse } from '@/types/api/roomStatus';
import { ROOM_STATUS } from '@/utils/statusColors';

interface UIRoomStatus {
  value: string;
  label: string;
}

export const useRoomStatus = () => {
  const [statuses, setStatuses] = useState<UIRoomStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatuses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = (await trpcClient.roomStatus.getAll.query()) as RoomStatusResponse[];

      // Mapear los estados del backend a estados UI con labels correctos
      const uiStatuses = data.map(status => ({
        value: status.value,
        label: ROOM_STATUS[status.value as keyof typeof ROOM_STATUS] || status.value,
      }));

      setStatuses(uiStatuses);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching statuses'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    statuses,
    isLoading,
    error,
    fetchStatuses,
  };
};
