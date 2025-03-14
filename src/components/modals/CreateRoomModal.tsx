import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/ui/button/Button';
import { toast } from 'react-hot-toast';
import { trpcClient } from '@/api/trpc';
import { useCategories } from '@/hooks/useCategories';
import { useFloors } from '@/hooks/useFloors';
import { useSectors } from '@/hooks/useSectors';
import { useRoomStatus } from '@/hooks/useRoomStatus';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, onSuccess }) => {
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
  const [formData, setFormData] = useState({
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

  // Establecer el estado inicial cuando se cargan los estados
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

  const renderFooter = () => (
    <div className="flex gap-3">
      <Button variant="outline" onClick={onClose} disabled={isSubmitting} size="sm">
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={
          isSubmitting ||
          isLoadingCategories ||
          isLoadingFloors ||
          isLoadingSectors ||
          isLoadingStatuses
        }
        size="sm"
      >
        {isSubmitting ? 'Creando...' : 'Crear Habitación'}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Habitación" footer={renderFooter()}>
      <form id="createRoomForm" className="space-y-6">
        {(categoriesError || floorsError || sectorsError || statusesError) && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            Error al cargar los datos. Por favor, intenta de nuevo.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Número de Habitación
            </label>
            <input
              type="number"
              id="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-boxdark"
              required
              min="1"
            />
          </div>

          <div>
            <label
              htmlFor="floor"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Piso
            </label>
            <select
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-boxdark"
              required
              disabled={isLoadingFloors}
            >
              <option value="">{isLoadingFloors ? 'Cargando pisos...' : 'Seleccionar piso'}</option>
              {floors.map(floor => (
                <option key={floor} value={floor}>
                  {floor}º Piso
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sector"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sector
            </label>
            <select
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-boxdark"
              disabled={isLoadingSectors}
            >
              <option value="">
                {isLoadingSectors ? 'Cargando sectores...' : 'Seleccionar sector (opcional)'}
              </option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Categoría
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-boxdark"
              required
              disabled={isLoadingCategories}
            >
              <option value="">
                {isLoadingCategories ? 'Cargando categorías...' : 'Seleccionar categoría'}
              </option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} - {category.capacity} personas
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="statusValue"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Estado
            </label>
            <select
              id="statusValue"
              name="statusValue"
              value={formData.statusValue}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-boxdark"
              required
              disabled={isLoadingStatuses}
            >
              <option value="">
                {isLoadingStatuses ? 'Cargando estados...' : 'Seleccionar estado'}
              </option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateRoomModal;
