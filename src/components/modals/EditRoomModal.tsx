import React, { useState, useEffect } from 'react';
import { RoomResponse } from '@/types/api/room';
import Modal from '@/components/common/Modal';
import Button from '@/components/ui/button/Button';
import { toast } from 'react-hot-toast';
import { trpcClient } from '@/api/trpc';
import { ROOM_STATUS } from '@/utils/statusColors';

interface EditRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomResponse | null;
  onSuccess?: () => void;
}

const EditRoomModal: React.FC<EditRoomModalProps> = ({ isOpen, onClose, room, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    number: '',
    floor: '',
    sector: '',
    statusValue: '',
  });

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number.toString(),
        floor: room.floor,
        sector: room.sector || '',
        statusValue: room.status.value,
      });
    }
  }, [room]);

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
    if (!room) return;

    try {
      setIsSubmitting(true);
      await trpcClient.rooms.update.mutate({
        id: room.id,
        number: parseInt(formData.number),
        floor: formData.floor,
        sector: formData.sector || undefined,
        statusValue: formData.statusValue,
      });

      toast.success('Habitación actualizada exitosamente');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error('Error al actualizar la habitación');
      console.error('Error updating room:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFooter = () => (
    <div className="flex gap-3">
      <Button variant="outline" onClick={onClose} disabled={isSubmitting} size="sm">
        Cancelar
      </Button>
      <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} size="sm">
        {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    </div>
  );

  if (!room) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Habitación" footer={renderFooter()}>
      <form id="editRoomForm" className="space-y-6">
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
            <input
              type="text"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-boxdark"
              required
            />
          </div>

          <div>
            <label
              htmlFor="sector"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Sector
            </label>
            <input
              type="text"
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-boxdark"
              placeholder="Opcional"
            />
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
            >
              <option value="AVAILABLE">{ROOM_STATUS.AVAILABLE}</option>
              <option value="UNAVAILABLE">{ROOM_STATUS.UNAVAILABLE}</option>
              <option value="CLEANING">{ROOM_STATUS.CLEANING}</option>
              <option value="MAINTENANCE">{ROOM_STATUS.MAINTENANCE}</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditRoomModal;
