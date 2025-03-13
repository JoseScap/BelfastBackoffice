'use client';

import React, { useEffect } from 'react';

// Hooks
import { useRooms } from '@/hooks/useRooms';
import { useModal } from '@/hooks/useModal';

// Components
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMetadata from '@/components/common/PageMetadata';
import SearchFilter from '@/components/common/SearchFilter';
import Pagination from '@/components/tables/Pagination';
import { DashboardIcons, IconWrapper } from '@/components/common/icons';
import {
  NumberCell,
  CategoryCell,
  FloorCell,
  CapacityCell,
  RoomStatusCell,
  ActionsCell,
} from '@/components/tables/TableCells';
import ViewRoomModal from '@/components/modals/ViewRoomModal';
import EditRoomModal from '@/components/modals/EditRoomModal';
import DeleteRoomModal from '@/components/modals/DeleteRoomModal';

// Types
import { RoomStatusValue } from '@/types/hotel';

const ITEMS_PER_PAGE = 10;

const TABLE_HEADERS = [
  { key: 'number', label: 'Número', minWidth: '100px' },
  { key: 'category', label: 'Categoría', minWidth: '150px' },
  { key: 'floor', label: 'Piso', minWidth: '100px' },
  { key: 'capacity', label: 'Capacidad', minWidth: '120px' },
  { key: 'status', label: 'Estado', minWidth: '120px' },
  { key: 'actions', label: 'Acciones', minWidth: 'auto' },
] as const;

// Mapeo de valores de estado del backend a valores de estado de la UI
const mapStatusToUI = (backendStatus: string): RoomStatusValue => {
  const statusMap: Record<string, RoomStatusValue> = {
    AVAILABLE: 'Disponible',
    UNAVAILABLE: 'No Disponible',
    CLEANING: 'Limpieza',
    MAINTENANCE: 'Mantenimiento',
  };

  return statusMap[backendStatus] || 'Disponible';
};

const RoomsPage = () => {
  const {
    currentRooms,
    filteredRooms,
    selectedRoom,
    currentPage,
    searchTerm,
    isLoading,
    isLoadingRoom,
    error,
    filters,
    setCurrentPage,
    setSearchTerm,
    fetchRooms,
    handleRoomAction,
  } = useRooms();

  const modal = useModal();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleViewRoom = async (id: string) => {
    await handleRoomAction(id);
    modal.open('ROOM_VIEW');
  };

  const handleEditRoom = async (id: string) => {
    await handleRoomAction(id);
    modal.open('ROOM_EDIT');
  };

  const handleDeleteRoom = async (id: string) => {
    await handleRoomAction(id);
    modal.open('ROOM_DELETE', {
      title: 'Eliminar Habitación',
      size: 'sm',
      preventClose: true,
    });
  };

  const handleCreateRoom = () => {
    modal.open('ROOM_CREATE', {
      title: 'Nueva Habitación',
      size: 'lg',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-red-500">Error al cargar habitaciones: {error.message}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-80"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      <PageMetadata
        title="Habitaciones | Belfast Backoffice"
        description="Gestión de habitaciones para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Habitaciones" />

      {/* Modals */}
      <ViewRoomModal
        isOpen={modal.isModalType('ROOM_VIEW')}
        onClose={modal.close}
        room={selectedRoom}
        isLoading={isLoadingRoom}
      />

      <EditRoomModal
        isOpen={modal.isModalType('ROOM_EDIT')}
        onClose={modal.close}
        room={selectedRoom}
        onSuccess={() => {
          modal.close();
          fetchRooms();
        }}
      />

      <DeleteRoomModal
        isOpen={modal.isModalType('ROOM_DELETE')}
        onClose={modal.close}
        room={selectedRoom}
        onSuccess={() => {
          modal.close();
          fetchRooms();
        }}
      />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchFilter<string>
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            totalResults={filteredRooms.length}
          />

          <button
            onClick={handleCreateRoom}
            className="flex items-center gap-2 rounded-md bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Crear nueva habitación"
          >
            <IconWrapper className="fill-white">
              <DashboardIcons.Hotel />
            </IconWrapper>
            Nueva Habitación
          </button>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto" role="grid" aria-label="Tabla de habitaciones">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  {TABLE_HEADERS.map(header => (
                    <th
                      key={header.key}
                      className={`${
                        header.minWidth ? `min-w-[${header.minWidth}]` : ''
                      } py-4 px-4 font-medium text-black dark:text-white`}
                      scope="col"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRooms.length > 0 ? (
                  currentRooms.map(room => (
                    <tr key={room.id}>
                      <NumberCell number={room.number} />
                      <CategoryCell
                        name={room.category.name}
                        description={room.category.description}
                      />
                      <FloorCell floor={parseInt(room.floor)} />
                      <CapacityCell capacity={room.category.capacity} />
                      <RoomStatusCell status={mapStatusToUI(room.status.value)} />
                      <ActionsCell
                        onView={() => handleViewRoom(room.id)}
                        onEdit={() => handleEditRoom(room.id)}
                        onDelete={() => handleDeleteRoom(room.id)}
                      />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={TABLE_HEADERS.length}
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      No se encontraron habitaciones
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {currentRooms.length > 0 && (
          <div className="flex items-center justify-between">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredRooms.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default RoomsPage;
