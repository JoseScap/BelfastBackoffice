'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Componentes
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

// tRPC
import { trpcClient } from '@/api/trpc';
import { RoomResponse } from '@/types/api/room';
import { RoomStatusValue } from '@/types/hotel';

interface StatusConfig {
  label: string;
}

type StatusKey = string;
type FilterKey = 'all' | StatusKey;

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG: Record<string, StatusConfig> = {
  AVAILABLE: {
    label: 'Disponible',
  },
  UNAVAILABLE: {
    label: 'No Disponible',
  },
  CLEANING: {
    label: 'Limpieza',
  },
  MAINTENANCE: {
    label: 'Mantenimiento',
  },
};

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
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all');
  const [floorFilter, setFloorFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setIsLoading(true);
      const realResult = await trpcClient.rooms.getByFilter.query({
        filter: {},
        deleted: false,
      });
      setRooms(realResult);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('Error desconocido'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar habitaciones
  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleViewRoom = useCallback(async (id: string) => {
    try {
      setIsLoadingRoom(true);
      setIsViewModalOpen(true);

      const room = await trpcClient.rooms.getById.query({ id, deleted: false });
      setSelectedRoom(room);
    } catch (error) {
      console.error('Error al cargar los detalles de la habitación:', error);
      toast.error('Error al cargar los detalles de la habitación');
    } finally {
      setIsLoadingRoom(false);
    }
  }, []);

  const handleCloseViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setSelectedRoom(null);
  }, []);

  const handleEditRoom = useCallback(async (id: string) => {
    try {
      setIsLoadingRoom(true);
      setIsEditModalOpen(true);

      const room = await trpcClient.rooms.getById.query({ id, deleted: false });
      setSelectedRoom(room);
    } catch (error) {
      console.error('Error al cargar los detalles de la habitación:', error);
      toast.error('Error al cargar los detalles de la habitación');
    } finally {
      setIsLoadingRoom(false);
    }
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedRoom(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleDeleteRoom = useCallback(async (id: string) => {
    try {
      setIsLoadingRoom(true);
      setIsDeleteModalOpen(true);

      const room = await trpcClient.rooms.getById.query({ id, deleted: false });
      setSelectedRoom(room);
    } catch (error) {
      console.error('Error al cargar los detalles de la habitación:', error);
      toast.error('Error al cargar los detalles de la habitación');
    } finally {
      setIsLoadingRoom(false);
    }
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedRoom(null);
  }, []);

  const handleDeleteSuccess = useCallback(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleCreateRoom = useCallback(() => {
    // Implementar lógica de crear habitación
  }, []);

  // Obtener opciones de filtro desde los datos reales
  const filters = useMemo(() => {
    const uniqueStatuses = new Set<string>();
    const uniqueFloors = new Set<string>();
    const uniqueCategories = new Set<string>();

    rooms.forEach((room: RoomResponse) => {
      uniqueStatuses.add(room.status.value);
      uniqueFloors.add(room.floor);
      uniqueCategories.add(room.category.name);
    });

    return [
      {
        id: 'status',
        label: 'Estado',
        value: statusFilter,
        onChange: setStatusFilter,
        options: [
          { value: 'all', label: 'Todos los Estados' },
          ...Array.from(uniqueStatuses).map(value => ({
            value,
            label: STATUS_CONFIG[value]?.label || value,
          })),
        ],
      },
      {
        id: 'floor',
        label: 'Piso',
        value: floorFilter,
        onChange: setFloorFilter,
        options: [
          { value: 'all', label: 'Todos los Pisos' },
          ...Array.from(uniqueFloors).map(floor => ({
            value: floor,
            label: `Piso ${floor}`,
          })),
        ],
      },
      {
        id: 'category',
        label: 'Categoría',
        value: categoryFilter,
        onChange: setCategoryFilter,
        options: [
          { value: 'all', label: 'Todas las Categorías' },
          ...Array.from(uniqueCategories).map(category => ({
            value: category,
            label: category,
          })),
        ],
      },
    ];
  }, [rooms, statusFilter, floorFilter, categoryFilter]);

  // Filtrar habitaciones según búsqueda y filtros
  const filteredRooms = useMemo(() => {
    if (!rooms.length) return [];

    const searchLower = searchTerm.toLowerCase();
    return rooms.filter((room: RoomResponse) => {
      const matchesSearch =
        room.number.toString().includes(searchTerm) ||
        room.category.name.toLowerCase().includes(searchLower) ||
        room.category.description.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || room.status.value === statusFilter;
      const matchesFloor = floorFilter === 'all' || room.floor === floorFilter;
      const matchesCategory = categoryFilter === 'all' || room.category.name === categoryFilter;

      return matchesSearch && matchesStatus && matchesFloor && matchesCategory;
    });
  }, [rooms, searchTerm, statusFilter, floorFilter, categoryFilter]);

  // Ordenar habitaciones por número
  const sortedRooms = useMemo(
    () => [...filteredRooms].sort((a, b) => a.number - b.number),
    [filteredRooms]
  );

  // Paginación
  const currentRooms = useMemo(
    () => sortedRooms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [sortedRooms, currentPage]
  );

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

      {/* View Modal */}
      <ViewRoomModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        room={selectedRoom}
        isLoading={isLoadingRoom}
      />

      {/* Edit Modal */}
      <EditRoomModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        room={selectedRoom}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Modal */}
      <DeleteRoomModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        room={selectedRoom}
        onSuccess={handleDeleteSuccess}
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
              totalItems={sortedRooms.length}
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
