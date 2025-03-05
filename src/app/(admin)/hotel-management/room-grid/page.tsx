'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { mockRooms } from '@/mock-data';
import { ROOM_STATUS, Room, RoomStatusValue } from '@/types/hotel';
import PageMetadata from '@/components/common/PageMetadata';
import { getRoomStatusConfig } from '@/utils/statusColors';
import { FloorSelect, DateSelect } from '@/components/common/SelectControls';
import { toast } from 'react-hot-toast';
import PendingCounter from '@/components/common/PendingCounter';
import StatusCounter from '@/components/common/StatusCounter';
import RoomCard from '@/components/hotel/RoomCard';

// Tipo para las operaciones en cola
type QueuedOperation = {
  id: string; // ID único para la operación
  roomId: string;
  newStatus: RoomStatusValue;
  previousStatus: RoomStatusValue;
  roomNumber: number;
  timestamp: number; // Timestamp para ordenar las operaciones
  status: 'pending' | 'loading' | 'success' | 'error'; // Estado de la operación
};

// Componente para la columna de estado
const StatusColumn = ({
  status,
  rooms,
  statusBackground,
  getCategoryColor,
  onMoveRoom,
  pendingOperationsCount,
  onDragStart,
}: {
  status: RoomStatusValue;
  rooms: Room[];
  statusBackground: string;
  getCategoryColor: (categoryName: string) => string;
  onMoveRoom: (roomId: string, newStatus: RoomStatusValue) => void;
  pendingOperationsCount: number;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, roomId: string) => void;
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

// Generar un ID único
const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export default function RoomGridPage() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [searchTerm, setSearchTerm] = useState('');

  // Cola de operaciones pendientes
  const [operations, setOperations] = useState<QueuedOperation[]>([]);

  // Referencia para los timeouts
  const timeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Manejar el inicio del arrastre
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, roomId: string) => {
    e.dataTransfer.setData('roomId', roomId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // Calcular operaciones pendientes (status: pending o loading)
  const pendingOperations = useMemo(() => {
    return operations.filter(op => op.status === 'pending' || op.status === 'loading');
  }, [operations]);

  // Procesar datos
  const { floors, roomsByStatus, pendingOperationsByStatus } = useMemo(() => {
    const uniqueFloors = [...new Set(rooms.map(room => room.floor))].sort((a, b) => a - b);
    const currentFloor = selectedFloor !== null ? selectedFloor : uniqueFloors[0];

    // Filtrar por piso y término de búsqueda global
    let filteredRooms = rooms.filter(room => room.floor === currentFloor);

    if (searchTerm) {
      filteredRooms = filteredRooms.filter(
        room =>
          room.number.toString().includes(searchTerm) ||
          room.category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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

    filteredRooms.forEach(room => {
      groupedRooms[room.status.value].push(room);
    });

    return {
      floors: uniqueFloors,
      roomsByStatus: groupedRooms,
      pendingOperationsByStatus: pendingByStatus,
    };
  }, [rooms, selectedFloor, pendingOperations, searchTerm]);

  // Función para generar color para categorías
  const getCategoryColor = useCallback((categoryName: string): string => {
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return `#${'00000'.substring(0, 6 - c.length)}${c}`;
  }, []);

  const currentFloor = selectedFloor ?? floors[0];

  // Efecto para procesar las operaciones pendientes
  useEffect(() => {
    // Limpiar timeouts al desmontar
    return () => {
      Object.values(timeoutsRef.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Manejar el movimiento de habitaciones
  const handleMoveRoom = useCallback(
    (roomId: string, newStatus: RoomStatusValue) => {
      console.log(`Moviendo habitación ${roomId} a ${newStatus}`);

      // Encontrar la habitación
      const roomToMove = rooms.find(room => room.id === roomId);

      if (!roomToMove) {
        console.error('No se encontró la habitación');
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

      // Actualizar estado (actualización optimista)
      const newRooms = [...rooms];
      const roomIndex = newRooms.findIndex(room => room.id === roomId);

      if (roomIndex === -1) {
        console.error('No se encontró la habitación en el array');
        return;
      }

      // Guardar estado anterior para posible rollback
      const previousStatus = newRooms[roomIndex].status.value;

      // Actualizar habitación inmediatamente (optimista)
      newRooms[roomIndex] = {
        ...newRooms[roomIndex],
        status: {
          ...newRooms[roomIndex].status,
          value: newStatus,
        },
      };

      // Actualizar estado
      setRooms(newRooms);

      // Crear ID único para la operación
      const operationId = generateId();

      // Añadir operación a la cola con ID único
      const newOperation: QueuedOperation = {
        id: operationId,
        roomId,
        newStatus,
        previousStatus,
        roomNumber: roomToMove.number,
        timestamp: Date.now(),
        status: 'pending',
      };

      // Actualizar la cola de operaciones
      setOperations(prev => [...prev, newOperation]);

      // Mostrar toast de carga
      const toastId = toast.loading(`Actualizando habitación ${roomToMove.number}...`);

      // Simular API - 3 segundos
      setTimeout(() => {
        // Actualización exitosa
        toast.dismiss(toastId);
        toast.success(`Habitación ${roomToMove.number} actualizada a ${newStatus}`);

        // Eliminar la operación de la cola
        setOperations(prev => prev.filter(op => op.id !== operationId));
      }, 3000);
    },
    [rooms, pendingOperations]
  );

  return (
    <>
      <PageMetadata
        title="Cuadrícula de Habitaciones | Belfast Backoffice"
        description="Gestión visual de habitaciones para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Cuadrícula de Habitaciones" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-full sm:w-auto">
              <FloorSelect value={currentFloor} floors={floors} onChange={setSelectedFloor} />
            </div>
            <div className="w-full sm:w-auto">
              <DateSelect value={selectedDate} onChange={setSelectedDate} />
            </div>
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar habitación..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stroke rounded dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PendingCounter count={pendingOperations.length} />
            <button className="flex items-center gap-2 rounded-md bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80">
              <svg
                className="fill-white"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14.3333 7.33333V3.33333C14.3333 2.96667 14.0333 2.66667 13.6667 2.66667H10.3333C9.96667 2.66667 9.66667 2.96667 9.66667 3.33333V7.33333C9.66667 7.7 9.96667 8 10.3333 8H13.6667C14.0333 8 14.3333 7.7 14.3333 7.33333ZM14.3333 12.6667V10C14.3333 9.63333 14.0333 9.33333 13.6667 9.33333H10.3333C9.96667 9.33333 9.66667 9.63333 9.66667 10V12.6667C9.66667 13.0333 9.96667 13.3333 10.3333 13.3333H13.6667C14.0333 13.3333 14.3333 13.0333 14.3333 12.6667ZM6.33333 12.6667V8.66667C6.33333 8.3 6.03333 8 5.66667 8H2.33333C1.96667 8 1.66667 8.3 1.66667 8.66667V12.6667C1.66667 13.0333 1.96667 13.3333 2.33333 13.3333H5.66667C6.03333 13.3333 6.33333 13.0333 6.33333 12.6667ZM6.33333 3.33333V5.33333C6.33333 5.7 6.03333 6 5.66667 6H2.33333C1.96667 6 1.66667 5.7 1.66667 5.33333V3.33333C1.66667 2.96667 1.96667 2.66667 2.33333 2.66667H5.66667C6.03333 2.66667 6.33333 2.96667 6.33333 3.33333Z" />
              </svg>
              Vista de Impresión
            </button>
          </div>
        </div>

        {/* Room Grid with Drag and Drop */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Piso {currentFloor} - {selectedDate}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(ROOM_STATUS).map(status => {
              const { background } = getRoomStatusConfig(status);
              return (
                <StatusColumn
                  key={status}
                  status={status}
                  rooms={roomsByStatus[status] || []}
                  statusBackground={background}
                  getCategoryColor={getCategoryColor}
                  onMoveRoom={handleMoveRoom}
                  pendingOperationsCount={pendingOperationsByStatus[status] || 0}
                  onDragStart={handleDragStart}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
