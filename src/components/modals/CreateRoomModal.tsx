import React, { memo } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/ui/button/Button';
import SelectField from '@/components/common/SelectField';
import { useCreateRoomForm } from '@/hooks/useCreateRoomForm';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
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
  } = useCreateRoomForm({ isOpen, onClose, onSuccess });

  const renderFooter = () => (
    <div className="flex gap-3">
      <Button variant="outline" onClick={onClose} disabled={isSubmitting} size="sm">
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={isSubmitting || isLoading}
        size="sm"
      >
        {isSubmitting ? 'Creando...' : 'Crear Habitación'}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Habitación" footer={renderFooter()}>
      <form id="createRoomForm" className="space-y-6">
        {hasError && (
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

          <SelectField
            id="floor"
            name="floor"
            value={formData.floor}
            onChange={handleInputChange}
            options={floors.map(floor => ({ value: floor, label: `${floor}º Piso` }))}
            label="Piso"
            required
            isLoading={isLoadingFloors}
            loadingText="Cargando pisos..."
            placeholder="Seleccionar piso"
          />

          <SelectField
            id="sector"
            name="sector"
            value={formData.sector}
            onChange={handleInputChange}
            options={sectors.map(sector => ({ value: sector, label: sector }))}
            label="Sector"
            isLoading={isLoadingSectors}
            loadingText="Cargando sectores..."
            placeholder="Seleccionar sector (opcional)"
          />

          <SelectField
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            options={categories.map(category => ({
              value: category.id,
              label: `${category.name} - ${category.capacity} personas`,
            }))}
            label="Categoría"
            required
            isLoading={isLoadingCategories}
            loadingText="Cargando categorías..."
            placeholder="Seleccionar categoría"
          />

          <SelectField
            id="statusValue"
            name="statusValue"
            value={formData.statusValue}
            onChange={handleInputChange}
            options={statuses.map(status => ({
              value: status.value,
              label: status.label,
            }))}
            label="Estado"
            required
            isLoading={isLoadingStatuses}
            loadingText="Cargando estados..."
            placeholder="Seleccionar estado"
          />
        </div>
      </form>
    </Modal>
  );
};

export default memo(CreateRoomModal);
