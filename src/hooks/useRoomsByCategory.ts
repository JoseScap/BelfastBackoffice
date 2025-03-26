import { useState, useCallback } from 'react';
import { trpcClient } from '@/api/trpc';
import type { RoomResponse } from '@/types/api/room';

export const useRoomsByCategory = () => {
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoomsByCategory = useCallback(async (categoryId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await trpcClient.rooms.getByFilter.query({
        filter: {
          categoryId,
        },
        deleted: false,
      });
      setRooms(data);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError(err instanceof Error ? err : new Error('Error fetching rooms'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    rooms,
    isLoading,
    error,
    fetchRoomsByCategory,
  };
};
