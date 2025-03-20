'use client';

import React, { useState, useMemo, useEffect } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMetadata from '@/components/common/PageMetadata';
import { DateSelect } from '@/components/common/SelectControls';
import SearchFilter from '@/components/common/SearchFilter';
import RoomGrid from '@/components/hotel/RoomGrid';
import { useRooms } from '@/hooks/useRooms';
import { Room, RoomCategory } from '@/types/hotel';
import { RoomResponse } from '@/types/api/room';
import { mapRoomStatusToUI } from '@/utils/statusColors';

// Memoize these functions outside the component to prevent recreation
const adaptRoomCategory = (category: RoomResponse['category']): RoomCategory => ({
  ...category,
  price: 0,
  images: [],
});

const adaptRoomResponseToRoom = (room: RoomResponse): Room => ({
  id: room.id,
  number: room.number,
  floor: parseInt(room.floor),
  capacity: 2,
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
  const [isLoading, setIsLoading] = useState(true);

  const { rooms, searchTerm, setSearchTerm, floorFilter, setFloorFilter, fetchRooms } = useRooms();

  // Inicialización
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);
        const initialFloor = '1';
        setFloorFilter(initialFloor);
        await fetchRooms();
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [fetchRooms, setFloorFilter]);

  // Recargar cuando cambie el piso
  useEffect(() => {
    const loadRooms = async () => {
      if (!floorFilter) return;

      try {
        if (rooms.length === 0) {
          setIsLoading(true);
        }
        await fetchRooms();
      } finally {
        setIsLoading(false);
      }
    };

    loadRooms();
  }, [floorFilter, fetchRooms, rooms.length]);

  // Memoize floor data
  const floors = useMemo(() => {
    const uniqueFloors = [...new Set(rooms.map(room => room.floor))].sort();
    return uniqueFloors.length > 0 ? uniqueFloors : ['1'];
  }, [rooms]);

  // Memoize filters component
  const filtersComponent = useMemo(
    () => (
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
    ),
    [searchTerm, setSearchTerm, floorFilter, floors, setFloorFilter]
  );

  // Memoize filtered and adapted rooms
  const adaptedRooms = useMemo(() => {
    const currentFloor = floorFilter || '1';
    return rooms.filter(room => room.floor === currentFloor).map(adaptRoomResponseToRoom);
  }, [rooms, floorFilter]);

  return (
    <>
      <PageMetadata
        title="Cuadrícula de Habitaciones | Belfast Backoffice"
        description="Gestión visual de habitaciones para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Cuadrícula de Habitaciones" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <div className="flex flex-col gap-4">
          {filtersComponent}
          <div className="flex items-center gap-4">
            <div className="w-full sm:w-auto">
              <DateSelect value={selectedDate} onChange={setSelectedDate} />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Piso {floorFilter || floors[0]} - {selectedDate}
          </h4>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <RoomGrid rooms={adaptedRooms} onRoomUpdated={fetchRooms} />
          )}
        </div>
      </div>
    </>
  );
}
