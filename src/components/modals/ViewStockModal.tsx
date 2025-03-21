import React, { useState } from 'react';
import type { Stock } from '@/types/api/stock';
import { toast } from 'react-hot-toast';
import Modal from '@/components/common/Modal';
import Button from '@/components/ui/button/Button';
import { BsCalendar, BsHouse } from 'react-icons/bs';

interface ViewStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock;
  category: { id: string; name: string } | undefined;
  onUpdatePrice: (params: {
    fromDate: string;
    toDate: string;
    categoryId: string;
    price: number;
  }) => Promise<void>;
}

export const ViewStockModal: React.FC<ViewStockModalProps> = ({
  isOpen,
  onClose,
  stock,
  category,
  onUpdatePrice,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStock, setEditedStock] = useState(stock);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  // Formatear fecha para mostrar
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);
      await onUpdatePrice({
        fromDate: editedStock.fromDate,
        toDate: editedStock.toDate,
        categoryId: editedStock.categoryId,
        price: editedStock.price,
      });
      toast.success('Precio actualizado exitosamente');
      setIsEditing(false);
    } catch (error) {
      console.error('Error al actualizar el precio:', error);
      toast.error('Ha ocurrido un error al actualizar el precio. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderFooter = () => (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onClose} size="sm" disabled={isUpdating}>
        Cerrar
      </Button>
      {isEditing ? (
        <>
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              setEditedStock(stock);
            }}
            size="sm"
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            size="sm"
            disabled={isUpdating || editedStock.price === stock.price}
          >
            {isUpdating ? 'Guardando...' : 'Guardar'}
          </Button>
        </>
      ) : (
        <Button
          variant="primary"
          onClick={() => setIsEditing(true)}
          size="sm"
          disabled={isUpdating}
        >
          Editar
        </Button>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalles del Stock - ${category?.name || 'No especificada'}`}
      footer={renderFooter()}
    >
      <div className="space-y-6">
        {/* Período */}
        <div className="rounded-xl border border-stroke bg-gray-50/50 p-4 dark:border-strokedark dark:bg-meta-4">
          <h4 className="mb-2 text-sm font-medium text-black dark:text-white">Período</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <BsCalendar size={22} className="mt-2" />
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Desde</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(stock.fromDate)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <BsCalendar size={22} className="mt-2" />
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Hasta</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(stock.toDate)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-4">
          {/* Cantidad de Habitaciones */}
          <div className="rounded-xl border border-stroke bg-gray-50/50 p-4 dark:border-strokedark dark:bg-meta-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <BsHouse size={24} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-black dark:text-white">Habitaciones</h4>
                <p className="mt-1 text-2xl font-bold text-black dark:text-white">
                  {stock.stockQuantity}
                </p>
              </div>
            </div>
          </div>

          {/* Precio por Noche */}
          <div className="rounded-xl border border-stroke bg-gray-50/50 p-4 dark:border-strokedark dark:bg-meta-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-black dark:text-white">Precio por Noche</h4>
                {isEditing ? (
                  <div className="relative mt-1">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-2xl font-bold text-black dark:text-white">
                      $
                    </span>
                    <input
                      type="number"
                      value={editedStock.price}
                      onChange={e =>
                        setEditedStock(prev => ({
                          ...prev,
                          price: parseInt(e.target.value) || 0,
                        }))
                      }
                      min="0"
                      className="w-full rounded-lg border border-stroke bg-transparent pl-6 pr-2 py-1 text-2xl font-bold text-black outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
                    />
                  </div>
                ) : (
                  <p className="mt-1 text-2xl font-bold text-black dark:text-white">
                    ${stock.price.toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
