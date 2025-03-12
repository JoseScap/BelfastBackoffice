import React from 'react';
import { RoomResponse } from '@/types/api/room';
import Modal from '@/components/common/Modal';
import Button from '@/components/ui/button/Button';
import { getRoomStatusConfig } from '@/utils/statusColors';
import { RoomStatusValue, ROOM_STATUS } from '@/types/hotel';

// Mapeo de valores de estado del backend a valores de estado de la UI
const mapStatusToUI = (backendStatus: string): RoomStatusValue => {
  const statusMap: Record<string, RoomStatusValue> = {
    AVAILABLE: ROOM_STATUS.AVAILABLE,
    UNAVAILABLE: ROOM_STATUS.UNAVAILABLE,
    CLEANING: ROOM_STATUS.CLEANING,
    MAINTENANCE: ROOM_STATUS.MAINTENANCE,
  };

  return statusMap[backendStatus] || ROOM_STATUS.AVAILABLE;
};

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  colSpan?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value, colSpan }) => (
  <div className={`space-y-2 ${colSpan ? 'col-span-2' : ''}`}>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
    <div className="text-base font-semibold text-black dark:text-white">{value}</div>
  </div>
);

interface ViewRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: RoomResponse | null;
  isLoading: boolean;
}

const ViewRoomModal: React.FC<ViewRoomModalProps> = ({ isOpen, onClose, room, isLoading }) => {
  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Habitación">
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        </div>
      </Modal>
    );
  }

  if (!room) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Detalles de la Habitación">
        <div className="flex h-40 items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No se encontró la habitación</p>
        </div>
      </Modal>
    );
  }

  const uiStatus = mapStatusToUI(room.status.value);
  const { background, text } = getRoomStatusConfig(uiStatus);

  const details: DetailItemProps[] = [
    {
      label: 'Número',
      value: <span className="font-mono">#{room.number}</span>,
    },
    {
      label: 'Piso',
      value: `${room.floor}º Piso`,
    },
    {
      label: 'Categoría',
      value: room.category.name,
    },
    {
      label: 'Capacidad',
      value: (
        <div className="flex items-center gap-2">
          {room.category.capacity} {room.category.capacity === 1 ? 'persona' : 'personas'}
        </div>
      ),
    },
    {
      label: 'Estado',
      value: (
        <span
          className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${background} ${text}`}
        >
          {uiStatus}
        </span>
      ),
    },
    {
      label: 'Sector',
      value: room.sector,
    },
    {
      label: 'Descripción de la Categoría',
      value: room.category.description,
      colSpan: true,
    },
  ];

  const renderFooter = () => (
    <Button variant="outline" onClick={onClose} size="sm">
      Cerrar
    </Button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Habitación"
      footer={renderFooter()}
    >
      <div className="grid grid-cols-2 gap-6">
        {details.map((detail, index) => (
          <DetailItem key={index} {...detail} />
        ))}
      </div>
    </Modal>
  );
};

export default ViewRoomModal;
