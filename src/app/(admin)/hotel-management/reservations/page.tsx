'use client';

import React, { useState, useMemo, useCallback } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { mockAppointments } from '@/mock-data';
import { AppointmentStatusValue } from '@/types/hotel';
import Pagination from '@/components/tables/Pagination';
import PageMetadata from '@/components/common/PageMetadata';
import SearchFilter from '@/components/common/SearchFilter';
import { DashboardIcons, IconWrapper } from '@/components/common/icons';
import {
  GuestCell,
  RoomCell,
  DateCell,
  AppointmentStatusCell,
  SourceCell,
  PriceCell,
  ActionsCell,
} from '@/components/tables/TableCells';

// Tipos
type StatusConfig = {
  label: string;
};

type SourceKey = 'app' | 'manual';
type StatusKey = AppointmentStatusValue;
type FilterKey = 'all' | StatusKey;
type SourceFilterKey = 'all' | SourceKey;

// Constantes
const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG: Record<StatusKey, StatusConfig> = {
  Aprobado: {
    label: 'Aprobado',
  },
  Solicitado: {
    label: 'Solicitado',
  },
  'Check-in': {
    label: 'Check-in',
  },
  'Check-out': {
    label: 'Check-out',
  },
  Cancelado: {
    label: 'Cancelado',
  },
  Sobrevendido: {
    label: 'Sobrevendido',
  },
};

const SOURCE_CONFIG: Record<SourceKey, string> = {
  app: 'Aplicación',
  manual: 'Manual',
} as const;

const TABLE_HEADERS = [
  { key: 'guest', label: 'Huésped', minWidth: '150px' },
  { key: 'room', label: 'Habitación', minWidth: '100px' },
  { key: 'checkIn', label: 'Check-in', minWidth: '120px' },
  { key: 'checkOut', label: 'Check-out', minWidth: '120px' },
  { key: 'status', label: 'Estado', minWidth: '100px' },
  { key: 'source', label: 'Fuente', minWidth: '100px' },
  { key: 'total', label: 'Total', minWidth: '100px' },
  { key: 'actions', label: 'Acciones', minWidth: 'auto' },
] as const;

const ReservationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilterKey>('all');

  // Handlers
  const handleViewReservation = useCallback((id: string) => {
    console.log('Ver reservación:', id);
    // Implementar lógica para ver detalles
  }, []);

  const handleDeleteReservation = useCallback((id: string) => {
    console.log('Eliminar reservación:', id);
    // Implementar lógica para eliminar
  }, []);

  const handleCreateReservation = useCallback(() => {
    console.log('Crear nueva reservación');
    // Implementar lógica para crear
  }, []);

  // Memoizar los appointments filtrados
  const filteredAppointments = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return mockAppointments.filter(appointment => {
      const matchesSearch =
        appointment.guest.firstName.toLowerCase().includes(searchLower) ||
        appointment.guest.lastName.toLowerCase().includes(searchLower) ||
        appointment.room.number.toString().includes(searchTerm) ||
        appointment.status.value.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || appointment.status.value === statusFilter;
      const matchesSource = sourceFilter === 'all' || appointment.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [searchTerm, statusFilter, sourceFilter]);

  // Memoizar los appointments ordenados
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort(
      (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );
  }, [filteredAppointments]);

  // Paginar appointments
  const currentAppointments = useMemo(
    () =>
      sortedAppointments.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [sortedAppointments, currentPage]
  );

  // Opciones de los filtros
  const statusOptions = useMemo(
    () => [
      { value: 'all' as const, label: 'Todos los Estados' },
      ...Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({
        value: value as StatusKey,
        label,
      })),
    ],
    []
  );

  const sourceOptions = useMemo(
    () => [
      { value: 'all' as const, label: 'Todas las Fuentes' },
      ...Object.entries(SOURCE_CONFIG).map(([value, label]) => ({
        value: value as SourceKey,
        label,
      })),
    ],
    []
  );

  return (
    <>
      <PageMetadata
        title="Reservas | Belfast Backoffice"
        description="Gestión de reservaciones para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Reservas" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 flex-wrap">
            <SearchFilter<FilterKey>
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={[
                {
                  id: 'status',
                  label: 'Estado',
                  value: statusFilter,
                  onChange: setStatusFilter,
                  options: [{ value: 'all', label: 'Todos los Estados' }, ...statusOptions],
                },
              ]}
              totalResults={filteredAppointments.length}
            />
            <div className="w-full sm:w-auto">
              <select
                className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value as SourceFilterKey)}
                aria-label="Filtrar por fuente"
              >
                {sourceOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateReservation}
              className="flex items-center gap-2 rounded-md bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="Crear nueva reservación"
            >
              <IconWrapper className="fill-white">
                <DashboardIcons.Alert />
              </IconWrapper>
              Nueva Reservación
            </button>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto" role="grid" aria-label="Tabla de reservaciones">
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
                {currentAppointments.map(appointment => (
                  <tr key={appointment.id}>
                    <GuestCell
                      firstName={appointment.guest.firstName}
                      lastName={appointment.guest.lastName}
                      email={appointment.guest.email}
                    />
                    <RoomCell
                      number={appointment.room.number}
                      categoryName={appointment.room.category.name}
                    />
                    <DateCell date={appointment.checkInDate} />
                    <DateCell date={appointment.checkOutDate} />
                    <AppointmentStatusCell status={appointment.status.value} />
                    <SourceCell label={SOURCE_CONFIG[appointment.source]} />
                    <PriceCell amount={appointment.totalPrice} />
                    <ActionsCell
                      onView={() => handleViewReservation(appointment.id)}
                      onDelete={() => handleDeleteReservation(appointment.id)}
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
            totalItems={sortedAppointments.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default ReservationsPage;
