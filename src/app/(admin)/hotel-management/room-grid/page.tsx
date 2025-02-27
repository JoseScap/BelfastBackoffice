'use client';

import React, { useState, useMemo } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { mockRooms } from '@/mock-data';
import { RoomStatusValue } from '@/types/hotel';
import PageMetadata from '@/components/common/PageMetadata';
import { getRoomStatusConfig } from '@/utils/statusColors';
import {
  FloorSelect,
  DateSelect,
  StatusLegend,
  CategoryLegend,
} from '@/components/common/SelectControls';

// Movemos la metadata a un archivo separado
// export const metadata: Metadata = {
//   title: 'Room Grid | Belfast Backoffice',
//   description: 'Visual room grid management for Belfast Backoffice',
// };

// Componentes
interface RoomCardProps {
  room: (typeof mockRooms)[0];
  statusBackground: string;
  categoryColor: string;
}

const RoomCard = React.memo(({ room, statusBackground, categoryColor }: RoomCardProps) => (
  <div className="relative flex flex-col rounded-sm border border-stroke bg-white p-3 shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className={`absolute right-2 top-2 h-3 w-3 rounded-full ${statusBackground}`} />
    <div
      className="absolute left-0 top-0 h-1 w-full rounded-t-sm"
      style={{ backgroundColor: categoryColor }}
    />
    <h5 className="mt-1 text-lg font-semibold text-black dark:text-white">{room.number}</h5>
    <p className="text-sm text-gray-500 dark:text-gray-400">{room.category.name}</p>
    <p className="mt-1 text-xs">
      <span className="font-medium">Capacidad:</span> {room.capacity}
    </p>
    <div className="mt-2 flex items-center justify-between">
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusBackground} text-white`}>
        {room.status.value}
      </span>
      <button
        className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white"
        aria-label="Ver detalles"
      >
        <svg
          className="fill-current"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.4999 9C16.4999 13.14 13.1399 16.5 8.99993 16.5C4.85993 16.5 1.49993 13.14 1.49993 9C1.49993 4.86 4.85993 1.5 8.99993 1.5C13.1399 1.5 16.4999 4.86 16.4999 9Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.7749 11.3249L9.3249 9.89994V5.82494"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
));
RoomCard.displayName = 'RoomCard';

const RoomGridPage = () => {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Memoizar datos procesados
  const { floors, roomsOnFloor, roomCategories } = useMemo(() => {
    const uniqueFloors = [...new Set(mockRooms.map(room => room.floor))].sort((a, b) => a - b);
    const currentFloor = selectedFloor !== null ? selectedFloor : uniqueFloors[0];
    const filteredRooms = mockRooms.filter(room => room.floor === currentFloor);
    const uniqueCategories = [...new Set(mockRooms.map(room => room.category.name))];

    return {
      floors: uniqueFloors,
      roomsOnFloor: filteredRooms,
      roomCategories: uniqueCategories,
    };
  }, [selectedFloor]);

  // Función para generar color consistente para categorías
  const getCategoryColor = useMemo(() => {
    return (categoryName: string) => {
      let hash = 0;
      for (let i = 0; i < categoryName.length; i++) {
        hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
      }
      const c = (hash & 0x00ffffff).toString(16).toUpperCase();
      return `#${'00000'.substring(0, 6 - c.length)}${c}`;
    };
  }, []);

  const currentFloor = selectedFloor ?? floors[0];

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
          </div>

          <div className="flex items-center gap-4">
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

        {/* Legend */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-2 text-lg font-semibold text-black dark:text-white">Leyenda</h4>
          <div className="flex flex-wrap gap-4">
            <StatusLegend />
            <CategoryLegend categories={roomCategories} getCategoryColor={getCategoryColor} />
          </div>
        </div>

        {/* Room Grid */}
        <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Piso {currentFloor} - {selectedDate}
          </h4>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {roomsOnFloor.map(room => {
              const { background } = getRoomStatusConfig(room.status.value as RoomStatusValue);
              return (
                <RoomCard
                  key={room.id}
                  room={room}
                  statusBackground={background}
                  categoryColor={getCategoryColor(room.category.name)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomGridPage;
