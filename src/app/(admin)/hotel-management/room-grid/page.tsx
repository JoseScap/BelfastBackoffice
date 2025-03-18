'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { trpcClient } from '@/api/trpc';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMetadata from '@/components/common/PageMetadata';
import { DateSelect } from '@/components/common/SelectControls';
import PendingCounter from '@/components/common/PendingCounter';
import StatusColumn from '@/components/hotel/StatusColumn';
import SearchFilter from '@/components/common/SearchFilter';
import { useRooms } from '@/hooks/useRooms';
import { RoomStatusValue, Room, RoomCategory } from '@/types/hotel';
import { RoomResponse } from '@/types/api/room';
import { ROOM_STATUS, mapRoomStatusToUI } from '@/utils/statusColors';

// Función para mapear estados de UI a estados del backend
const mapUIStatusToBackend = (uiStatus: RoomStatusValue): string => {
  switch (uiStatus) {
    case 'Disponible':
      return 'AVAILABLE';
    case 'No Disponible':
      return 'UNAVAILABLE';
    case 'Limpieza':
      return 'CLEANING';
    case 'Mantenimiento':
      return 'MAINTENANCE';
    default:
      return uiStatus;
  }
};

// Tipo para las operaciones en cola
type QueuedOperation = {
  id: string;
  roomId: string;
  newStatus: RoomStatusValue;
  previousStatus: RoomStatusValue;
  roomNumber: number;
  timestamp: number;
  status: 'pending' | 'loading' | 'success' | 'error';
};

// Función para adaptar la categoría de la habitación
const adaptRoomCategory = (category: RoomResponse['category']): RoomCategory => ({
  ...category,
  price: 0, // Este valor debería venir del backend
  images: [], // Este valor debería venir del backend
});

// Función para adaptar RoomResponse a Room
const adaptRoomResponseToRoom = (room: RoomResponse): Room => ({
  id: room.id,
  number: room.number,
  floor: parseInt(room.floor),
  capacity: 2, // Valor por defecto
  beds: {
    single: 1,
    double: 0,
    queen: 0,
    king: 0,
  },
  status: {
    id: room.status.id,
    description: room.status.description,
    value: mapRoomStatusToUI(room.status.value),
  },
  category: adaptRoomCategory(room.category),
});

export default function RoomGridPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [operations, setOperations] = useState<QueuedOperation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [temporaryRooms, setTemporaryRooms] = useState<Room[]>([]);

  // Obtener habitaciones usando el hook
  const { rooms, searchTerm, setSearchTerm, floorFilter, setFloorFilter, fetchRooms } = useRooms();

  // Obtener pisos únicos de las habitaciones y filtrar habitaciones por piso
  const { floors, filteredRooms } = useMemo(() => {
    const uniqueFloors = [...new Set(rooms.map(room => room.floor))].sort();
    const currentFloor = floorFilter || '1';
    const baseRooms = rooms
      .filter(room => room.floor === currentFloor)
      .map(adaptRoomResponseToRoom);

    // Aplicar cambios temporales si existen
    const updatedRooms = baseRooms.map(room => {
      const tempRoom = temporaryRooms.find(tr => tr.id === room.id);
      return tempRoom || room;
    });

    return {
      floors: uniqueFloors.length > 0 ? uniqueFloors : ['1'],
      filteredRooms: updatedRooms,
    };
  }, [rooms, floorFilter, temporaryRooms]);

  // Inicialización
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        // Primero establecemos el piso inicial
        const initialFloor = '1';
        setFloorFilter(initialFloor);

        // Luego hacemos el fetch con ese piso
        await fetchRooms();
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [fetchRooms, setFloorFilter]); // Solo se ejecuta una vez al montar el componente

  // Recargar cuando cambie el piso
  useEffect(() => {
    const loadRooms = async () => {
      if (floorFilter) {
        try {
          // Solo mostrar loading si no hay datos
          if (rooms.length === 0) {
            setIsLoading(true);
          }
          await fetchRooms();
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadRooms();
  }, [floorFilter, fetchRooms, rooms.length]);

  // Calcular operaciones pendientes
  const pendingOperations = useMemo(() => {
    return operations.filter(op => op.status === 'pending' || op.status === 'loading');
  }, [operations]);

  // Procesar datos
  const { roomsByStatus, pendingOperationsByStatus } = useMemo(() => {
    // Agrupar habitaciones por estado
    const groupedRooms = Object.values(ROOM_STATUS).reduce((acc, status) => {
      acc[status] = [];
      return acc;
    }, {} as Record<RoomStatusValue, Room[]>);

    // Contar operaciones pendientes por estado
    const pendingByStatus = Object.values(ROOM_STATUS).reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<RoomStatusValue, number>);

    // Contar operaciones pendientes por estado de destino
    pendingOperations.forEach(op => {
      pendingByStatus[op.newStatus] = (pendingByStatus[op.newStatus] || 0) + 1;
    });

    // Agrupar habitaciones filtradas por estado
    filteredRooms.forEach(room => {
      if (groupedRooms[room.status.value]) {
        groupedRooms[room.status.value].push(room);
      }
    });

    return {
      roomsByStatus: groupedRooms,
      pendingOperationsByStatus: pendingByStatus,
    };
  }, [filteredRooms, pendingOperations]);

  // Función para generar color para categorías
  const getCategoryColor = useCallback((categoryName: string): string => {
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return `#${'00000'.substring(0, 6 - c.length)}${c}`;
  }, []);

  // Manejar el inicio del arrastre
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, roomId: string) => {
    e.dataTransfer.setData('roomId', roomId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // Manejar el movimiento de habitaciones
  const handleMoveRoom = useCallback(
    async (roomId: string, newStatus: RoomStatusValue) => {
      // Encontrar la habitación
      const roomToMove = rooms.find(room => room.id === roomId);

      if (!roomToMove) {
        toast.error('No se encontró la habitación');
        return;
      }

      // Si el estado es el mismo, no hacer nada
      if (roomToMove.status.value === newStatus) {
        return;
      }

      // Verificar si ya hay demasiadas operaciones pendientes
      if (pendingOperations.length >= 3) {
        toast.error('Hay demasiadas operaciones pendientes. Por favor, espera a que se completen.');
        return;
      }

      // Crear ID único para la operación
      const operationId = crypto.randomUUID();
      const previousStatus = mapRoomStatusToUI(roomToMove.status.value);

      // Actualizar estado temporal inmediatamente
      const updatedRoom: Room = {
        ...adaptRoomResponseToRoom(roomToMove),
        status: {
          ...roomToMove.status,
          value: newStatus,
        },
      };

      // Actualizar estado temporal y operaciones de manera atómica
      setTemporaryRooms(prev => [...prev.filter(r => r.id !== roomId), updatedRoom]);
      setOperations(prev => [
        ...prev,
        {
          id: operationId,
          roomId,
          newStatus,
          previousStatus,
          roomNumber: roomToMove.number,
          timestamp: Date.now(),
          status: 'loading',
        },
      ]);

      try {
        // Convertir el estado de UI al valor del backend
        const backendStatus = mapUIStatusToBackend(newStatus);

        // Actualizar en el backend
        await trpcClient.rooms.updateStatus.mutate({
          id: roomId,
          statusValue: backendStatus,
        });

        // Actualizar operación a success
        setOperations(prev =>
          prev.map(op => (op.id === operationId ? { ...op, status: 'success' } : op))
        );

        // Limpiar después de un corto tiempo
        setTimeout(() => {
          setOperations(prev => prev.filter(op => op.id !== operationId));
          setTemporaryRooms(prev => prev.filter(room => room.id !== roomId));

          // Hacer un fetch silencioso después de limpiar el estado temporal
          fetchRooms().catch(console.error);
        }, 2000);
      } catch (error) {
        // Revertir el cambio temporal inmediatamente
        setTemporaryRooms(prev => prev.filter(room => room.id !== roomId));
        setOperations(prev =>
          prev.map(op => (op.id === operationId ? { ...op, status: 'error' } : op))
        );

        toast.error('Error al actualizar la habitación');
        console.error('Error updating room:', error);

        // Limpiar operación de error después de un corto tiempo
        setTimeout(() => {
          setOperations(prev => prev.filter(op => op.id !== operationId));
        }, 500);
      }
    },
    [rooms, pendingOperations.length, fetchRooms]
  );

  // Mapear los estados del backend a los estados de UI
  const uiStatuses = useMemo(() => {
    return Object.values(ROOM_STATUS).map(status => ({
      value: status,
      label: status,
    }));
  }, []);

  return (
    <>
      <PageMetadata
        title="Cuadrícula de Habitaciones | Belfast Backoffice"
        description="Gestión visual de habitaciones para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Cuadrícula de Habitaciones" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {/* Controls */}
        <div className="flex flex-col gap-4">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={[
              {
                id: 'floor',
                label: 'Piso',
                value: floorFilter || floors[0],
                onChange: setFloorFilter,
                options: floors.map(floor => ({
                  value: floor,
                  label: `Piso ${floor}`,
                })),
              },
            ]}
          />
          <div className="flex items-center gap-4">
            <div className="w-full sm:w-auto">
              <DateSelect value={selectedDate} onChange={setSelectedDate} />
            </div>
            <PendingCounter count={pendingOperations.length} />
          </div>
        </div>

        {/* Room Grid with Drag and Drop */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Piso {floorFilter || floors[0]} - {selectedDate}
          </h4>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {uiStatuses.map(status => (
                <StatusColumn
                  key={status.value}
                  status={status.value}
                  rooms={roomsByStatus[status.value] || []}
                  getCategoryColor={getCategoryColor}
                  onMoveRoom={handleMoveRoom}
                  pendingOperationsCount={pendingOperationsByStatus[status.value] || 0}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
