import React, { useState } from 'react';
import type { Stock } from '@/types/api/stock';
import Modal from '@/components/common/Modal';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  newStock: Stock;
  setNewStock: (stock: Stock) => void;
  categories: { id: string; name: string }[];
}

export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  newStock,
  setNewStock,
  categories,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Calcular el número de días entre las fechas seleccionadas
  const getDaysBetweenDates = () => {
    if (!newStock.fromDate || !newStock.toDate) return 0;
    const start = new Date(newStock.fromDate);
    const end = new Date(newStock.toDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // Calcular el precio total
  const getTotalPrice = () => {
    if (!newStock.price || !newStock.fromDate || !newStock.toDate) return 0;
    return newStock.price * getDaysBetweenDates();
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit();
    } catch (error) {
      console.error('Error al guardar el stock:', error);
    } finally {
      onClose();

      setIsSubmitting(false);
    }
  };

  const renderFooter = () => (
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="rounded-lg border border-stroke px-4 py-2 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white dark:hover:bg-meta-4"
        disabled={isSubmitting}
      >
        Cancelar
      </button>
      <button
        onClick={handleSubmit}
        disabled={
          isSubmitting ||
          !newStock.categoryId ||
          !newStock.fromDate ||
          !newStock.toDate ||
          (newStock.price !== undefined && newStock.price <= 0) ||
          (newStock.stockQuantity !== undefined && newStock.stockQuantity <= 0)
        }
        className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-opacity-90 disabled:bg-opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Añadir Stock de Habitaciones"
      footer={renderFooter()}
    >
      <div className="space-y-6">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-black dark:text-white">
            Categoría de Habitación
          </label>
          <select
            value={newStock.categoryId || ''}
            onChange={e => setNewStock({ ...newStock, categoryId: e.target.value })}
            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Fecha inicio
            </label>
            <input
              type="date"
              value={
                newStock.fromDate ? new Date(newStock.fromDate).toISOString().split('T')[0] : ''
              }
              onChange={e => {
                const date = new Date(e.target.value);
                setNewStock({ ...newStock, fromDate: date.toISOString() });
                // Si no hay fecha fin, establecerla igual a la fecha inicio
                if (!newStock.toDate) {
                  const updatedStock: Stock = {
                    ...newStock,
                    toDate: date.toISOString(),
                  };
                  setNewStock(updatedStock);
                }
              }}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Fecha fin
            </label>
            <input
              type="date"
              value={newStock.toDate ? new Date(newStock.toDate).toISOString().split('T')[0] : ''}
              onChange={e => {
                const date = new Date(e.target.value);
                setNewStock({ ...newStock, toDate: date.toISOString() });
              }}
              min={newStock.fromDate ? new Date(newStock.fromDate).toISOString().split('T')[0] : ''}
              className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Precio por noche ($)
            </label>
            <div className="relative">
              <input
                type="number"
                value={newStock.price || ''}
                onChange={e => setNewStock({ ...newStock, price: Number(e.target.value) })}
                className="w-full rounded-lg border border-stroke bg-transparent pl-3 pr-10 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
                placeholder="Precio por noche"
                min="0"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                $
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Habitaciones disponibles
            </label>
            <div className="relative">
              <input
                type="number"
                value={newStock.stockQuantity || ''}
                onChange={e => setNewStock({ ...newStock, stockQuantity: Number(e.target.value) })}
                className="w-full rounded-lg border border-stroke bg-transparent pl-3 pr-10 py-2 outline-none focus:border-primary focus-visible:shadow-none dark:border-strokedark dark:bg-meta-4"
                placeholder="Número de habitaciones"
                min="0"
                step="1"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50 dark:bg-meta-4 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-black dark:text-white">Resumen</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {newStock.fromDate && newStock.toDate
                ? `${getDaysBetweenDates()} días`
                : 'Selecciona fechas'}
            </span>
          </div>

          {newStock.categoryId && categories.find(c => c.id === newStock.categoryId) && (
            <div className="flex items-center mt-1">
              <span className="text-sm">
                {categories.find(c => c.id === newStock.categoryId)?.name}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm">Precio total por habitación:</span>
            <span className="font-bold">
              {newStock.price && newStock.fromDate && newStock.toDate
                ? `$${getTotalPrice()} ($${newStock.price}/noche × ${getDaysBetweenDates()} noches)`
                : '$0'}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};
