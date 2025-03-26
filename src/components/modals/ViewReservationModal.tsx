import React, { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/ui/button/Button';
import { BsPeople, BsHouse, BsPencil, BsTrash, BsX, BsCheck } from 'react-icons/bs';
import type { ListReservationsByStatusResponse } from '@/types/api/reservation';
import toast from 'react-hot-toast';
import { trpcClient } from '@/api/trpc';
import { useCategories } from '@/hooks/useCategories';
import { useRoomsByCategory } from '@/hooks/useRoomsByCategory';

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  colSpan?: boolean;
  isEditing?: boolean;
  onEdit?: (value: string) => void;
  type?: string;
  options?: { value: string; label: string; disabled?: boolean }[];
  initialValue?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  colSpan,
  isEditing = false,
  onEdit,
  type = 'text',
  options = [],
  initialValue,
}) => {
  const [tempValue, setTempValue] = useState(initialValue || (value as string));

  useEffect(() => {
    if (isEditing && initialValue !== undefined) {
      setTempValue(initialValue);
    } else {
      setTempValue(value as string);
    }
  }, [value, isEditing, initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = e.target.value;
    setTempValue(newValue);
    if (onEdit) {
      onEdit(newValue);
    }
  };

  return (
    <div className={`${colSpan ? 'col-span-2' : ''}`}>
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      </div>
      {isEditing && options.length > 0 ? (
        <select
          className="w-full rounded-lg border border-stroke bg-transparent px-3 py-1.5 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          value={tempValue}
          onChange={handleChange}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      ) : isEditing ? (
        <input
          type={type}
          className="w-full rounded-lg border border-stroke bg-transparent px-3 py-1.5 text-black outline-none focus:border-primary dark:border-strokedark dark:text-white dark:focus:border-primary"
          value={tempValue}
          onChange={handleChange}
        />
      ) : (
        <div className="text-base font-semibold text-black dark:text-white">{value}</div>
      )}
    </div>
  );
};

interface ViewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ListReservationsByStatusResponse | null;
  isLoading?: boolean;
  onUpdate?: () => void;
}

// Utility function for mapping API source to UI source
const mapApiSourceToUiSource = (apiSource: string): string =>
  ({
    APP: 'Aplicación',
    BACKOFFICE: 'Manual',
    WEBSITE: 'Sitio Web',
    BOOKING: 'Booking',
    WHATSAPP: 'WhatsApp',
    OTHER_PORTAL: 'Otro Portal',
    OTHERS: 'Otros',
  }[apiSource] || apiSource);

const ViewReservationModal: React.FC<ViewReservationModalProps> = ({
  isOpen,
  onClose,
  reservation,
  isLoading = false,
  onUpdate,
}) => {
  const [editedReservation, setEditedReservation] =
    useState<ListReservationsByStatusResponse | null>(null);
  const [selectedRoomDetails, setSelectedRoomDetails] = useState<{
    id: string;
    number: number;
    floor: number;
  } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { categories, fetchCategories } = useCategories();
  const { rooms: availableRooms, fetchRoomsByCategory } = useRoomsByCategory();

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  // Fetch rooms when category changes
  useEffect(() => {
    if (editedReservation?.category?.id) {
      fetchRoomsByCategory(editedReservation.category.id);
    }
  }, [editedReservation?.category?.id, fetchRoomsByCategory]);

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen && reservation) {
      setEditedReservation(JSON.parse(JSON.stringify(reservation)));
      // Si hay una habitación asignada, buscar sus detalles
      if (reservation.room?.id) {
        const roomDetails = availableRooms.find(room => room.id === reservation.room?.id);
        if (roomDetails) {
          setSelectedRoomDetails({
            id: roomDetails.id,
            number: roomDetails.number,
            floor: Number(roomDetails.floor),
          });
        }
      } else {
        setSelectedRoomDetails(null);
      }
    } else {
      setIsDeleting(false);
      setSelectedRoomDetails(null);
    }
  }, [isOpen, reservation, availableRooms]);

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Reserva">
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      </Modal>
    );
  }

  if (!reservation || !editedReservation) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Reserva">
        <div className="flex h-40 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No se encontró la reserva</p>
        </div>
      </Modal>
    );
  }

  const handleSave = async (field: string, value: string | number) => {
    try {
      if (field === 'roomId') {
        const selectedRoom = availableRooms.find(room => room.id === value);
        if (selectedRoom) {
          setSelectedRoomDetails({
            id: selectedRoom.id,
            number: selectedRoom.number,
            floor: Number(selectedRoom.floor),
          });
        }
      }

      await trpcClient.reservations.edit.mutate({
        id: editedReservation!.id,
        [field]: value,
      });

      toast.success('Campo actualizado exitosamente');
      onUpdate?.();
    } catch (error) {
      console.error('Error updating field:', error);
      toast.error('Error al actualizar el campo');
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      await trpcClient.reservations.cancel.mutate({
        id: reservation.id,
        cancelType: 'CANCELED',
      });

      toast.success('Reservación cancelada exitosamente');
      onClose();
      onUpdate?.();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      toast.error('Error al cancelar la reservación');
    }
  };

  const handleUpdatePassenger = (field: string, value: string) => {
    if (!editedReservation) return;

    const mainPassenger = { ...editedReservation.passengers[0] };
    if (field === 'firstName' || field === 'lastName') {
      mainPassenger[field] = value;
    }

    setEditedReservation({
      ...editedReservation,
      passengers: [mainPassenger, ...editedReservation.passengers.slice(1)],
    });
  };

  const sourceOptions = [
    { value: 'APP', label: 'Aplicación' },
    { value: 'BACKOFFICE', label: 'Manual' },
    { value: 'WEBSITE', label: 'Sitio Web' },
    { value: 'BOOKING', label: 'Booking' },
    { value: 'WHATSAPP', label: 'WhatsApp' },
    { value: 'OTHER_PORTAL', label: 'Otro Portal' },
    { value: 'OTHERS', label: 'Otros' },
  ];

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name,
  }));

  const roomOptions = availableRooms.map(room => ({
    value: room.id,
    label: `Habitación ${room.number} - ${room.floor}° Piso`,
  }));

  const renderFooter = () => (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button
              variant="primary"
              onClick={() => setIsEditing(false)}
              size="sm"
              startIcon={<BsCheck size={16} />}
            >
              Guardar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setEditedReservation(JSON.parse(JSON.stringify(reservation)));
              }}
              size="sm"
              startIcon={<BsX size={16} />}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="warning"
              onClick={handleDelete}
              size="sm"
              startIcon={<BsTrash size={16} />}
            >
              Cancelar Reserva
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsEditing(true)}
              size="sm"
              startIcon={<BsPencil size={16} />}
            >
              Editar
            </Button>
          </>
        )}
      </div>
      {!isEditing && (
        <Button variant="outline" onClick={onClose} size="sm">
          Cerrar
        </Button>
      )}
    </div>
  );

  // Formatear fecha para mostrar
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Formatear fecha para input
  const formatDateForInput = (dateStr: string) => {
    return dateStr; // Ya viene en formato YYYY-MM-DD
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reserva #${editedReservation.id}`}
      footer={renderFooter()}
      size="lg"
    >
      <div className="space-y-4">
        {/* Información Principal */}
        <div className="grid grid-cols-2 gap-4">
          {/* Fechas y Huésped */}
          <div className="rounded-xl border border-stroke bg-gray-50/50 p-4 dark:border-strokedark dark:bg-meta-4">
            <div className="flex items-center gap-3 mb-4">
              <BsPeople size={20} className="text-primary" />
              <div className="flex-1">
                <DetailItem
                  label="Huésped"
                  value={`${editedReservation.passengers[0].firstName} ${editedReservation.passengers[0].lastName}`}
                  isEditing={isEditing}
                  onEdit={value => {
                    const [firstName, lastName] = value.split(' ');
                    handleUpdatePassenger('firstName', firstName);
                    handleUpdatePassenger('lastName', lastName || '');
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label="Check-in"
                value={formatDate(editedReservation.checkInDate)}
                isEditing={isEditing}
                onEdit={value => handleSave('checkInDate', value)}
                type="date"
                initialValue={formatDateForInput(editedReservation.checkInDate)}
              />
              <DetailItem
                label="Check-out"
                value={formatDate(editedReservation.checkOutDate)}
                isEditing={isEditing}
                onEdit={value => handleSave('checkOutDate', value)}
                type="date"
                initialValue={formatDateForInput(editedReservation.checkOutDate)}
              />
            </div>
          </div>

          {/* Estado y Pago */}
          <div className="rounded-xl border border-stroke bg-gray-50/50 p-4 dark:border-strokedark dark:bg-meta-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <DetailItem
                  label="Total"
                  value={`$${editedReservation.appliedDiscount.toLocaleString('es-ES')}`}
                  isEditing={isEditing}
                  onEdit={value => handleSave('extraDiscount', parseFloat(value))}
                  type="number"
                  initialValue={editedReservation.appliedDiscount.toString()}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <DetailItem
                label="Fuente"
                value={mapApiSourceToUiSource(editedReservation.source)}
                isEditing={isEditing}
                onEdit={value => handleSave('source', value)}
                options={sourceOptions}
                initialValue={editedReservation.source}
              />
            </div>
          </div>
        </div>

        {/* Detalles de Alojamiento */}
        <div className="rounded-xl border border-stroke bg-gray-50/50 p-4 dark:border-strokedark dark:bg-meta-4">
          <div className="flex items-center gap-3 mb-4">
            <BsHouse size={20} className="text-primary" />
            <h4 className="text-sm font-medium text-black dark:text-white">Alojamiento</h4>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DetailItem
              label="Categoría"
              value={editedReservation.category.name}
              isEditing={isEditing}
              onEdit={value => {
                const selectedCategory = categories.find(cat => cat.name === value);
                if (selectedCategory) {
                  handleSave('categoryId', selectedCategory.id);
                }
              }}
              options={categoryOptions}
              initialValue={editedReservation.category.id}
            />
            <DetailItem
              label="Habitación"
              value={
                selectedRoomDetails
                  ? `Habitación ${selectedRoomDetails.number} - ${selectedRoomDetails.floor}° Piso`
                  : 'No asignada'
              }
              isEditing={isEditing}
              onEdit={value => {
                const selectedRoom = availableRooms.find(room => room.id === value);
                if (selectedRoom) {
                  handleSave('roomId', selectedRoom.id);
                }
              }}
              options={roomOptions}
              initialValue={selectedRoomDetails?.id}
            />
          </div>
        </div>

        {/* Notas */}
        {editedReservation.notes && (
          <div className="rounded-xl border border-stroke bg-gray-50/50 p-4 dark:border-strokedark dark:bg-meta-4">
            <DetailItem
              label="Notas"
              value={editedReservation.notes}
              isEditing={isEditing}
              onEdit={value => handleSave('notes', value)}
              colSpan={true}
              initialValue={editedReservation.notes}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewReservationModal;
