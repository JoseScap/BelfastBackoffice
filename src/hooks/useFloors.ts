import { useState, useCallback } from 'react';
import { trpcClient } from '@/api/trpc';

export const useFloors = () => {
  const [floors, setFloors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFloors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await trpcClient.rooms.getAllFloors.query({ deleted: false });
      console.log('Fetched floors:', data);
      setFloors(data);
    } catch (err) {
      console.error('Error fetching floors:', err);
      setError(err instanceof Error ? err : new Error('Error fetching floors'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    floors,
    isLoading,
    error,
    fetchFloors,
  };
};
