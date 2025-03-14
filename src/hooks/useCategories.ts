import { useState, useCallback } from 'react';
import { trpcClient } from '@/api/trpc';
import { RoomCategoryResponse } from '@/types/api/roomCategory';

export const useCategories = () => {
  const [categories, setCategories] = useState<RoomCategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await trpcClient.roomCategories.getAll.query(false);
      console.log('Fetched categories:', data);
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err : new Error('Error fetching categories'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    categories,
    isLoading,
    error,
    fetchCategories,
  };
};
