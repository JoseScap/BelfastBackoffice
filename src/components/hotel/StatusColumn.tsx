'use client';

import React, { useState, useMemo } from 'react';
import { Room, RoomStatusValue } from '@/types/hotel';
import RoomCard from './RoomCard';
import StatusCounter from '../common/StatusCounter';

type StatusColumnProps = {
  status: RoomStatusValue;
  rooms: Room[];
  statusBackground: string;
  getCategoryColor: (categoryName: string) => string;
  onMoveRoom: (roomId: string, newStatus: RoomStatusValue) => void;
  pendingOperationsCount: number;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, roomId: string) => void;
};

/**
 * Componente que muestra una columna de estado con las habitaciones correspondientes
 * y soporte para arrastrar y soltar.
 */
const StatusColumn: React.FC<StatusColumnProps> = ({
  status,
  rooms,
  statusBackground,
  getCategoryColor,
  onMoveRoom,
  pendingOperationsCount,
  onDragStart,
}) => {
  const [isOver, setIsOver] = useState(false);

  // Funciones para manejar eventos de arrastre
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    const roomId = e.dataTransfer.getData('roomId');
    if (roomId) {
      onMoveRoom(roomId, status);
    }
  };

  // Obtener la descripción del estado para el tooltip
  const statusDescription = useMemo(() => {
    const room = rooms[0];
    return room ? room.status.description : status;
  }, [rooms, status]);

  return (
    <div className="flex flex-col h-full border border-stroke rounded-md overflow-hidden shadow-sm dark:border-strokedark">
      <h3
        className={`text-lg font-semibold p-3 ${statusBackground} text-white flex items-center justify-between`}
        title={statusDescription}
      >
        <span>{status}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
            {rooms.length}
          </span>
          <StatusCounter count={pendingOperationsCount} />
        </div>
      </h3>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 p-3 transition-colors duration-200 ${
          isOver ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-boxdark'
        }`}
      >
        {rooms.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm italic">
            Arrastra habitaciones aquí
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {rooms.map(room => (
              <RoomCard
                key={room.id}
                room={room}
                statusBackground={statusBackground}
                categoryColor={getCategoryColor(room.category.name)}
                onDragStart={onDragStart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusColumn;
