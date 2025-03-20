import React, { useReducer, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { trpcClient } from '@/api/trpc';
import { Room, RoomStatusValue } from '@/types/hotel';
import { ROOM_STATUS, mapUIStatusToBackend, getCategoryColor } from '@/utils/statusColors';
import StatusColumn from './StatusColumn';

// Memoize status values outside component
const STATUS_VALUES = Object.values(ROOM_STATUS);

type RoomGridProps = {
  rooms: Room[];
  onRoomUpdated: () => Promise<void>;
};

type RoomDragState = {
  roomId: string | null;
  sourceStatus: RoomStatusValue | null;
};

type RoomGridState = {
  pendingUpdates: Record<string, RoomStatusValue>;
  dragState: RoomDragState;
};

type RoomGridAction =
  | { type: 'START_DRAG'; roomId: string; sourceStatus: RoomStatusValue }
  | { type: 'END_DRAG' }
  | { type: 'START_UPDATE'; roomId: string; newStatus: RoomStatusValue }
  | { type: 'COMPLETE_UPDATE'; roomId: string }
  | { type: 'FAIL_UPDATE'; roomId: string };

const initialState: RoomGridState = {
  pendingUpdates: {},
  dragState: { roomId: null, sourceStatus: null },
};

function gridReducer(state: RoomGridState, action: RoomGridAction): RoomGridState {
  switch (action.type) {
    case 'START_DRAG':
      return {
        ...state,
        dragState: {
          roomId: action.roomId,
          sourceStatus: action.sourceStatus,
        },
      };
    case 'END_DRAG':
      return {
        ...state,
        dragState: { roomId: null, sourceStatus: null },
      };
    case 'START_UPDATE':
      return {
        ...state,
        pendingUpdates: {
          ...state.pendingUpdates,
          [action.roomId]: action.newStatus,
        },
      };
    case 'COMPLETE_UPDATE':
    case 'FAIL_UPDATE': {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [action.roomId]: removed, ...remainingUpdates } = state.pendingUpdates;
      return {
        ...state,
        pendingUpdates: remainingUpdates,
      };
    }
    default:
      return state;
  }
}

const RoomGrid = React.memo(function RoomGrid({ rooms, onRoomUpdated }: RoomGridProps) {
  const [state, dispatch] = useReducer(gridReducer, initialState);
  const { pendingUpdates, dragState } = state;

  const handleDragStart = useCallback(
    (roomId: string) => {
      const room = rooms.find(r => r.id === roomId);
      if (room) {
        dispatch({
          type: 'START_DRAG',
          roomId,
          sourceStatus: room.status.value,
        });
      }
    },
    [rooms]
  );

  const handleDragEnd = useCallback(() => {
    dispatch({ type: 'END_DRAG' });
  }, []);

  const handleMoveRoom = useCallback(
    async (roomId: string, newStatus: RoomStatusValue) => {
      const room = rooms.find(r => r.id === roomId);
      if (!room) return;

      if (Object.keys(pendingUpdates).length >= 3) {
        toast.error('Hay demasiadas operaciones pendientes');
        return;
      }

      // Actualización optimista
      dispatch({ type: 'START_UPDATE', roomId, newStatus });

      try {
        await trpcClient.rooms.updateStatus.mutate({
          id: roomId,
          statusValue: mapUIStatusToBackend(newStatus),
        });

        // Actualizamos el estado local y mostramos éxito
        dispatch({ type: 'COMPLETE_UPDATE', roomId });
        toast.success(`Habitación ${room.number} movida a ${newStatus}`);

        // Actualizamos el estado del servidor en segundo plano
        onRoomUpdated().catch(() => {
          // Si falla la actualización del servidor, mostramos error pero mantenemos el estado local
          toast.error('Error al sincronizar con el servidor');
        });
      } catch {
        // En caso de error en la mutación, revertimos y actualizamos desde el servidor
        dispatch({ type: 'FAIL_UPDATE', roomId });
        toast.error(`Error al mover la habitación ${room.number}`);
        await onRoomUpdated();
      }
    },
    [rooms, onRoomUpdated, pendingUpdates]
  );

  // Agrupamos las habitaciones por su estado actual o pendiente
  const roomsByStatus = useMemo(() => {
    const result: Record<RoomStatusValue, Room[]> = {
      Limpieza: [],
      Disponible: [],
      'No Disponible': [],
      Mantenimiento: [],
    };

    rooms.forEach(room => {
      // Usamos el estado pendiente si existe, sino el estado actual
      const effectiveStatus = pendingUpdates[room.id] || room.status.value;
      result[effectiveStatus].push(room);
    });

    return result;
  }, [rooms, pendingUpdates]);

  const columnProps = useMemo(
    () => ({
      getCategoryColor,
      onMoveRoom: handleMoveRoom,
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      isDragging: dragState.roomId !== null,
    }),
    [dragState.roomId, handleMoveRoom, handleDragStart, handleDragEnd]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATUS_VALUES.map(status => (
        <StatusColumn
          key={status}
          status={status}
          rooms={roomsByStatus[status]}
          pendingUpdates={pendingUpdates}
          isValidDropTarget={dragState.sourceStatus !== status}
          {...columnProps}
        />
      ))}
    </div>
  );
});

export default RoomGrid;
