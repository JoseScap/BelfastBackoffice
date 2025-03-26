import React from 'react';
import type {
  ReservationFormData,
  ReservationSource,
  ReservationStatus,
} from '@/types/reservation';
import type { RoomCategoryResponse } from '@/types/api/roomCategory';
import type { RoomResponse } from '@/types/api/room';
import { SOURCE_OPTIONS, STATUS_OPTIONS } from '@/utils/reservationUtils';

interface ReservationDetailsStepProps {
  formData: ReservationFormData;
  onUpdateForm: (data: Partial<ReservationFormData>) => void;
  categories: RoomCategoryResponse[];
  availableRooms: RoomResponse[];
  isRoomsLoading: boolean;
}

export const ReservationDetailsStep: React.FC<ReservationDetailsStepProps> = ({
  formData,
  onUpdateForm,
  categories,
  availableRooms,
  isRoomsLoading,
}) => {
  const handleSourceChange = (value: string) => {
    onUpdateForm({ source: value as ReservationSource });
  };

  const handleStatusChange = (value: string) => {
    onUpdateForm({ status: value as ReservationStatus });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Habitación
          </label>
          <select
            value={formData.roomId}
            onChange={e => onUpdateForm({ roomId: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
            required
            disabled={isRoomsLoading}
          >
            <option value="">Seleccionar habitación</option>
            {availableRooms.map(room => (
              <option key={room.id} value={room.id}>
                Habitación {room.number}
              </option>
            ))}
          </select>
          {availableRooms.length === 0 && !isRoomsLoading && (
            <p className="mt-1 text-sm text-warning">
              No hay habitaciones disponibles en esta categoría
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Fuente de Reserva
          </label>
          <select
            value={formData.source}
            onChange={e => handleSourceChange(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
          >
            {SOURCE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Estado
          </label>
          <select
            value={formData.status}
            onChange={e => handleStatusChange(e.target.value)}
            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Descuento Aplicado ($)
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.appliedDiscount}
              onChange={e => onUpdateForm({ appliedDiscount: Number(e.target.value) })}
              className="w-full rounded-lg border border-stroke bg-transparent pl-3 pr-10 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
              min="0"
              step="0.01"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              $
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          Notas Adicionales
        </label>
        <textarea
          value={formData.notes}
          onChange={e => onUpdateForm({ notes: e.target.value })}
          className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
          rows={4}
          placeholder="Agregar notas o comentarios adicionales..."
        />
      </div>

      {/* Resumen final */}
      <div className="p-4 bg-gray-50 dark:bg-meta-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Resumen de la Reserva</h3>
        <div className="space-y-2 text-sm">
          <p>
            Check-in: {formData.checkInDate} {formData.checkInTime}
          </p>
          <p>
            Check-out: {formData.checkOutDate} {formData.checkOutTime}
          </p>
          <p>Categoría: {categories.find(c => c.id === formData.categoryId)?.name}</p>
          {formData.roomId && (
            <p>Habitación: {availableRooms.find(room => room.id === formData.roomId)?.number}</p>
          )}
          <p>Pasajeros: {formData.passengers.length}</p>
          <p>
            Titular: {formData.passengers[0].firstName} {formData.passengers[0].lastName}
          </p>
          <p>Estado: {STATUS_OPTIONS.find(s => s.value === formData.status)?.label}</p>
          <p>Fuente: {SOURCE_OPTIONS.find(s => s.value === formData.source)?.label}</p>
          {formData.appliedDiscount > 0 && <p>Descuento: ${formData.appliedDiscount}</p>}
        </div>
      </div>
    </div>
  );
};
