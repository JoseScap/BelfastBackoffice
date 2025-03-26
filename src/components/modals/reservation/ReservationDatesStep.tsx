import React from 'react';
import type { ReservationFormData } from '@/types/reservation';
import type { RoomCategoryResponse } from '@/types/api/roomCategory';

interface ReservationDatesStepProps {
  formData: ReservationFormData;
  onUpdateForm: (data: Partial<ReservationFormData>) => void;
  categories: RoomCategoryResponse[];
  isCategoriesLoading: boolean;
}

export const ReservationDatesStep: React.FC<ReservationDatesStepProps> = ({
  formData,
  onUpdateForm,
  categories,
  isCategoriesLoading,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Fecha de Check-in
          </label>
          <input
            type="date"
            value={formData.checkInDate}
            onChange={e => onUpdateForm({ checkInDate: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Hora de Check-in
          </label>
          <input
            type="time"
            value={formData.checkInTime}
            onChange={e => onUpdateForm({ checkInTime: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Fecha de Check-out
          </label>
          <input
            type="date"
            value={formData.checkOutDate}
            onChange={e => onUpdateForm({ checkOutDate: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
            min={formData.checkInDate || new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Hora de Check-out
          </label>
          <input
            type="time"
            value={formData.checkOutTime}
            onChange={e => onUpdateForm({ checkOutTime: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
            required
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          Categoría de Habitación
        </label>
        <select
          value={formData.categoryId}
          onChange={e => {
            onUpdateForm({ categoryId: e.target.value, roomId: '' }); // Reset room when category changes
          }}
          className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
          required
          disabled={isCategoriesLoading}
        >
          <option value="">Seleccionar categoría</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && !isCategoriesLoading && (
          <p className="mt-1 text-sm text-warning">No hay categorías disponibles</p>
        )}
      </div>

      {/* Resumen de la selección */}
      {formData.categoryId && (
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
          </div>
        </div>
      )}
    </div>
  );
};
