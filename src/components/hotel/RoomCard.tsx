'use client';

import React, { useMemo } from 'react';
import { Room, RoomStatusValue } from '@/types/hotel';
import { getRoomStatusConfig } from '@/utils/statusColors';

type RoomCardProps = {
  room: Room;
  categoryColor: string;
  nextState: RoomStatusValue | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
};

// Memoize status indicator component
const StatusIndicator = React.memo(function StatusIndicator({
  statusConfig,
  isPending,
}: {
  statusConfig: ReturnType<typeof getRoomStatusConfig>;
  isPending: boolean;
}) {
  return (
    <div
      className={`absolute right-2 top-2 h-3 w-3 rounded-full ${statusConfig.background} ${
        isPending ? 'animate-pulse' : ''
      }`}
    />
  );
});

// Memoize category indicator component
const CategoryIndicator = React.memo(function CategoryIndicator({
  categoryColor,
  categoryName,
}: {
  categoryColor: string;
  categoryName: string;
}) {
  return (
    <div
      className="absolute left-0 top-0 h-1 w-full rounded-t-sm"
      style={{ backgroundColor: categoryColor }}
      title={`Categoría: ${categoryName}`}
    />
  );
});

// Memoize status badge component
const StatusBadge = React.memo(function StatusBadge({
  statusConfig,
  statusValue,
  statusDescription,
  nextStatus,
}: {
  statusConfig: ReturnType<typeof getRoomStatusConfig>;
  statusValue: string;
  statusDescription: string;
  nextStatus: RoomStatusValue | null;
}) {
  const displayStatus = nextStatus || statusValue;
  const config = nextStatus ? getRoomStatusConfig(nextStatus) : statusConfig;

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${config.background} ${config.text} ${
        nextStatus ? 'animate-pulse' : ''
      }`}
      title={statusDescription}
    >
      {displayStatus}
    </span>
  );
});

/**
 * Componente que muestra una tarjeta de habitación con información básica
 * y soporte para arrastrar y soltar.
 */
const RoomCard = React.memo(function RoomCard({
  room,
  categoryColor,
  nextState,
  onDragStart,
  onDragEnd,
}: RoomCardProps) {
  // Memoize status configuration
  const statusConfig = useMemo(() => getRoomStatusConfig(room.status.value), [room.status.value]);

  // Memoize title
  const title = useMemo(
    () => `Categoría: ${room.category.name} - Capacidad: ${room.capacity} personas`,
    [room.category.name, room.capacity]
  );

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`relative flex flex-col rounded-sm border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark cursor-move hover:shadow-md transition-shadow duration-200 ${
        nextState ? 'opacity-80' : ''
      }`}
      title={title}
    >
      <StatusIndicator statusConfig={statusConfig} isPending={!!nextState} />
      <CategoryIndicator categoryColor={categoryColor} categoryName={room.category.name} />

      <h5 className="mt-1 text-lg font-semibold text-black dark:text-white">{room.number}</h5>
      <p className="text-sm text-gray-500 dark:text-gray-400">{room.category.name}</p>
      <p className="mt-1 text-xs">
        <span className="font-medium">Capacidad:</span> {room.capacity}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <StatusBadge
          statusConfig={statusConfig}
          statusValue={room.status.value}
          statusDescription={room.status.description}
          nextStatus={nextState}
        />
      </div>
    </div>
  );
});

export default RoomCard;
