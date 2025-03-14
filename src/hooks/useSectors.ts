import { useState, useCallback } from 'react';
import { trpcClient } from '@/api/trpc';

export const useSectors = () => {
  const [sectors, setSectors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSectors = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await trpcClient.rooms.getAllSectors.query({ deleted: false });
      console.log('Fetched sectors:', data);
      setSectors(data);
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setError(err instanceof Error ? err : new Error('Error fetching sectors'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sectors,
    isLoading,
    error,
    fetchSectors,
  };
};
