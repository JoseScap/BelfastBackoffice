'use client';

import React, { useMemo, useCallback, useState } from 'react';
import { Room, RoomStatusValue } from '@/types/hotel';
import RoomCard from './RoomCard';
import StatusCounter from '../common/StatusCounter';
import { getRoomStatusConfig } from '@/utils/statusColors';

type RoomStatusColumnProps = {
  status: RoomStatusValue;
  rooms: Room[];
  getCategoryColor: (categoryName: string) => string;
  onMoveRoom: (roomId: string, newStatus: RoomStatusValue) => void;
  pendingUpdates: Record<string, RoomStatusValue>;
  isDragging: boolean;
  isValidDropTarget: boolean;
  onDragStart: (roomId: string) => void;
  onDragEnd: () => void;
};

// Memoize empty state message
const EmptyStateMessage = React.memo(function EmptyStateMessage() {
  return (
    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500 text-sm italic">
      Arrastra habitaciones aquí
    </div>
  );
});

// Memoize individual room card to prevent unnecessary re-renders
const MemoizedRoomCard = React.memo(function MemoizedRoomCard({
  room,
  categoryColor,
  nextState,
  onDragStart,
  onDragEnd,
}: {
  room: Room;
  categoryColor: string;
  nextState: RoomStatusValue | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
}) {
  return (
    <RoomCard
      room={room}
      categoryColor={categoryColor}
      nextState={nextState}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    />
  );
});

/**
 * Componente que muestra una columna de estado con las habitaciones correspondientes
 * y soporte para arrastrar y soltar.
 */
const StatusColumn = React.memo(function StatusColumn({
  status,
  rooms,
  getCategoryColor,
  onMoveRoom,
  pendingUpdates,
  isDragging,
  isValidDropTarget,
  onDragStart,
  onDragEnd,
}: RoomStatusColumnProps) {
  const [isOver, setIsOver] = useState(false);

  // Memoize status configuration and header style
  const { headerStyle } = useMemo(() => {
    const statusConfig = getRoomStatusConfig(status);
    return {
      headerStyle: `text-lg font-semibold p-3 ${statusConfig.background} ${statusConfig.text} flex items-center justify-between`,
    };
  }, [status]);

  // Memoize drag handlers
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (isDragging && isValidDropTarget) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }
    },
    [isDragging, isValidDropTarget]
  );

  const handleDragLeave = useCallback(() => {
    setIsOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsOver(false);
      if (isDragging && isValidDropTarget) {
        const roomId = e.dataTransfer.getData('roomId');
        if (roomId) {
          onMoveRoom(roomId, status);
        }
      }
    },
    [isDragging, isValidDropTarget, onMoveRoom, status]
  );

  // Memoize room cards
  const roomCards = useMemo(() => {
    if (rooms.length === 0) {
      return <EmptyStateMessage />;
    }

    return rooms.map((room: Room) => {
      const categoryColor = getCategoryColor(room.category.name);
      const handleRoomDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('roomId', room.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(room.id);
      };

      return (
        <MemoizedRoomCard
          key={room.id}
          room={room}
          categoryColor={categoryColor}
          nextState={pendingUpdates[room.id] || null}
          onDragStart={handleRoomDragStart}
          onDragEnd={onDragEnd}
        />
      );
    });
  }, [rooms, getCategoryColor, onDragStart, onDragEnd, pendingUpdates]);

  // Memoize container style
  const containerStyle = useMemo(() => {
    return `flex-1 p-3 transition-colors duration-200 flex flex-col gap-3 ${
      isDragging && isValidDropTarget
        ? isOver
          ? 'bg-gray-200 dark:bg-gray-600'
          : 'bg-gray-100 dark:bg-gray-700'
        : 'bg-white dark:bg-boxdark'
    }`;
  }, [isDragging, isValidDropTarget, isOver]);

  // Calculate pending updates count
  const pendingCount = useMemo(() => {
    return Object.values(pendingUpdates).filter(s => s === status).length;
  }, [pendingUpdates, status]);

  return (
    <div className="flex flex-col h-full border border-stroke rounded-md overflow-hidden shadow-sm dark:border-strokedark">
      <h3 className={headerStyle} title={status}>
        <span>{status}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded-full">
            {rooms.length}
          </span>
          <StatusCounter count={pendingCount} />
        </div>
      </h3>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={containerStyle}
      >
        {roomCards}
      </div>
    </div>
  );
});

export default StatusColumn;
