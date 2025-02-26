"use client";

import React, { useState, useMemo, useCallback } from 'react';

// Componentes
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMetadata from '@/components/common/PageMetadata';
import SearchFilter from '@/components/common/SearchFilter';
import Pagination from '@/components/tables/Pagination';
import { DashboardIcons, IconWrapper } from '@/components/common/icons';

// Datos y tipos
import { mockRooms } from '@/mock-data';
import { RoomStatusValue } from '@/types/hotel';

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ReactNode;
}

type StatusKey = RoomStatusValue;
type FilterKey = 'all' | StatusKey;

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG: Record<StatusKey, StatusConfig> = {
  [RoomStatusValue.AVAILABLE]: {
    label: 'Disponible',
    color: 'bg-success-500 text-white',
    icon: <DashboardIcons.Bed />
  },
  [RoomStatusValue.UNAVAILABLE]: {
    label: 'No Disponible',
    color: 'bg-red-500 text-white',
    icon: <DashboardIcons.Alert />
  },
  [RoomStatusValue.CLEANING]: {
    label: 'Limpieza',
    color: 'bg-orange-500 text-white',
    icon: <DashboardIcons.List />
  },
  [RoomStatusValue.MAINTENANCE]: {
    label: 'Mantenimiento',
    color: 'bg-blue-500 text-white',
    icon: <DashboardIcons.Hotel />
  }
} as const;

const TABLE_HEADERS = [
  { key: 'number', label: 'Número', minWidth: '100px' },
  { key: 'category', label: 'Categoría', minWidth: '150px' },
  { key: 'floor', label: 'Piso', minWidth: '100px' },
  { key: 'capacity', label: 'Capacidad', minWidth: '120px' },
  { key: 'price', label: 'Precio/Noche', minWidth: '120px' },
  { key: 'status', label: 'Estado', minWidth: '120px' },
  { key: 'actions', label: 'Acciones', minWidth: 'auto' }
] as const;

// Componentes de tabla memoizados
const TableCell = React.memo(({ className, children }: { className?: string; children: React.ReactNode }) => (
  <td className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark ${className || ''}`}>
    {children}
  </td>
));
TableCell.displayName = 'TableCell';

const NumberCell = React.memo(({ number }: { number: number }) => (
  <TableCell>
    <h5 className="font-medium text-black dark:text-white">
      #{number}
    </h5>
  </TableCell>
));
NumberCell.displayName = 'NumberCell';

const CategoryCell = React.memo(({ name, description }: { name: string; description: string }) => (
  <TableCell>
    <h5 className="font-medium text-black dark:text-white">
      {name}
    </h5>
    <p className="text-sm">{description}</p>
  </TableCell>
));
CategoryCell.displayName = 'CategoryCell';

const FloorCell = React.memo(({ floor }: { floor: number }) => (
  <TableCell>
    <p className="text-black dark:text-white">
      {floor}º Piso
    </p>
  </TableCell>
));
FloorCell.displayName = 'FloorCell';

const CapacityCell = React.memo(({ capacity }: { capacity: number }) => (
  <TableCell>
    <p className="text-black dark:text-white">
      {capacity} {capacity === 1 ? 'persona' : 'personas'}
    </p>
  </TableCell>
));
CapacityCell.displayName = 'CapacityCell';

const PriceCell = React.memo(({ price }: { price: number }) => (
  <TableCell>
    <p className="text-black dark:text-white">
      ${price.toFixed(2)}
    </p>
  </TableCell>
));
PriceCell.displayName = 'PriceCell';

const StatusCell = React.memo(({ status }: { status: StatusKey }) => (
  <TableCell>
    <div className="flex items-center gap-2">
      <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${STATUS_CONFIG[status].color}`}>
        {STATUS_CONFIG[status].label}
      </span>
      <IconWrapper className="fill-current">
        {STATUS_CONFIG[status].icon}
      </IconWrapper>
    </div>
  </TableCell>
));
StatusCell.displayName = 'StatusCell';

interface ActionsCellProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionsCell = React.memo(({ onView, onEdit, onDelete }: ActionsCellProps) => (
  <TableCell>
    <div className="flex items-center space-x-3.5">
      <button 
        onClick={onView}
        className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1" 
        title="Ver detalles"
        aria-label="Ver detalles de la habitación"
      >
        <IconWrapper className="fill-current">
          <DashboardIcons.Search />
        </IconWrapper>
      </button>
      <button 
        onClick={onEdit}
        className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1" 
        title="Editar habitación"
        aria-label="Editar habitación"
      >
        <IconWrapper className="fill-current">
          <DashboardIcons.List />
        </IconWrapper>
      </button>
      <button 
        onClick={onDelete}
        className="hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1" 
        title="Eliminar habitación"
        aria-label="Eliminar habitación"
      >
        <IconWrapper className="fill-current">
          <DashboardIcons.Alert />
        </IconWrapper>
      </button>
    </div>
  </TableCell>
));
ActionsCell.displayName = 'ActionsCell';

const RoomsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all');

  const handleViewRoom = useCallback((id: string) => {
    console.log('Ver habitación:', id);
  }, []);

  const handleEditRoom = useCallback((id: string) => {
    console.log('Editar habitación:', id);
  }, []);

  const handleDeleteRoom = useCallback((id: string) => {
    console.log('Eliminar habitación:', id);
  }, []);

  const handleCreateRoom = useCallback(() => {
    console.log('Crear nueva habitación');
  }, []);

  const filteredRooms = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return mockRooms.filter(room => {
      const matchesSearch = 
        room.number.toString().includes(searchTerm) ||
        room.category.name.toLowerCase().includes(searchLower) ||
        room.category.description.toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === 'all' || room.status.value === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const sortedRooms = useMemo(() => (
    [...filteredRooms].sort((a, b) => a.number - b.number)
  ), [filteredRooms]);

  const currentRooms = useMemo(() => (
    sortedRooms.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    )
  ), [sortedRooms, currentPage]);

  const statusOptions = useMemo(() => [
    { value: 'all' as const, label: 'Todos los Estados' },
    ...Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({
      value: value as StatusKey,
      label
    }))
  ], []);

  return (
    <>
      <PageMetadata 
        title="Habitaciones | Belfast Backoffice"
        description="Gestión de habitaciones para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Habitaciones" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchFilter<FilterKey>
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={statusOptions}
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
                      className={`${header.minWidth ? `min-w-[${header.minWidth}]` : ''} py-4 px-4 font-medium text-black dark:text-white`}
                      scope="col"
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentRooms.map((room) => (
                  <tr key={room.id}>
                    <NumberCell number={room.number} />
                    <CategoryCell 
                      name={room.category.name}
                      description={room.category.description}
                    />
                    <FloorCell floor={room.floor} />
                    <CapacityCell capacity={room.capacity} />
                    <PriceCell price={room.category.price} />
                    <StatusCell status={room.status.value as StatusKey} />
                    <ActionsCell 
                      onView={() => handleViewRoom(room.id)}
                      onEdit={() => handleEditRoom(room.id)}
                      onDelete={() => handleDeleteRoom(room.id)}
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Pagination
            currentPage={currentPage}
            totalItems={sortedRooms.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default RoomsPage; 