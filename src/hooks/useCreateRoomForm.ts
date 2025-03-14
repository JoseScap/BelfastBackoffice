import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { trpcClient } from '@/api/trpc';
import { useCategories } from '@/hooks/useCategories';
import { useFloors } from '@/hooks/useFloors';
import { useSectors } from '@/hooks/useSectors';
import { useRoomStatus } from '@/hooks/useRoomStatus';

interface FormData {
  number: string;
  floor: string;
  sector: string;
  categoryId: string;
  statusValue: string;
}

interface UseCreateRoomFormProps {
  onSuccess?: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export const useCreateRoomForm = ({ onSuccess, onClose, isOpen }: UseCreateRoomFormProps) => {
  const {
    categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    fetchCategories,
  } = useCategories();
  const { floors, isLoading: isLoadingFloors, error: floorsError, fetchFloors } = useFloors();
  const { sectors, isLoading: isLoadingSectors, error: sectorsError, fetchSectors } = useSectors();
  const {
    statuses,
    isLoading: isLoadingStatuses,
    error: statusesError,
    fetchStatuses,
  } = useRoomStatus();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    number: '',
    floor: '',
    sector: '',
    categoryId: '',
    statusValue: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      fetchFloors();
      fetchSectors();
      fetchStatuses();
    }
  }, [isOpen, fetchCategories, fetchFloors, fetchSectors, fetchStatuses]);

  useEffect(() => {
    if (statuses.length > 0 && !formData.statusValue) {
      const availableStatus = statuses.find(status => status.value === 'AVAILABLE');
      if (availableStatus) {
        setFormData(prev => ({
          ...prev,
          statusValue: availableStatus.value,
        }));
      }
    }
  }, [statuses, formData.statusValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!formData.categoryId) {
      toast.error('Debes seleccionar una categoría');
      return;
    }

    try {
      setIsSubmitting(true);
      await trpcClient.rooms.create.mutate({
        number: parseInt(formData.number),
        floor: formData.floor,
        sector: formData.sector || undefined,
        categoryId: formData.categoryId,
        statusValue: formData.statusValue,
      });

      toast.success('Habitación creada exitosamente');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Error al crear la habitación');
      console.error('Error creating room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingCategories || isLoadingFloors || isLoadingSectors || isLoadingStatuses;
  const hasError = categoriesError || floorsError || sectorsError || statusesError;

  return {
    formData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
    isLoading,
    hasError,
    categories,
    floors,
    sectors,
    statuses,
    isLoadingCategories,
    isLoadingFloors,
    isLoadingSectors,
    isLoadingStatuses,
  };
};
