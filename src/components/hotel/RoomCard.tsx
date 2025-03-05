'use client';

import React from 'react';
import { Room } from '@/types/hotel';

type RoomCardProps = {
  room: Room;
  statusBackground: string;
  categoryColor: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, roomId: string) => void;
};

/**
 * Componente que muestra una tarjeta de habitación con información básica
 * y soporte para arrastrar y soltar.
 */
const RoomCard: React.FC<RoomCardProps> = ({
  room,
  statusBackground,
  categoryColor,
  onDragStart,
}) => {
  // Función para manejar el inicio del arrastre
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    onDragStart(e, room.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="relative flex flex-col rounded-sm border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark mb-3 cursor-move hover:shadow-md transition-shadow duration-200"
      title={`Categoría: ${room.category.name} - Capacidad: ${room.capacity} personas`}
    >
      <div className={`absolute right-2 top-2 h-3 w-3 rounded-full ${statusBackground}`} />
      <div
        className="absolute left-0 top-0 h-1 w-full rounded-t-sm"
        style={{ backgroundColor: categoryColor }}
        title={`Categoría: ${room.category.name}`}
      />
      <h5 className="mt-1 text-lg font-semibold text-black dark:text-white">{room.number}</h5>
      <p className="text-sm text-gray-500 dark:text-gray-400">{room.category.name}</p>
      <p className="mt-1 text-xs">
        <span className="font-medium">Capacidad:</span> {room.capacity}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${statusBackground} text-white`}
          title={room.status.description}
        >
          {room.status.value}
        </span>
      </div>
    </div>
  );
};

export default RoomCard;
