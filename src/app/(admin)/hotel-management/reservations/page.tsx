"use client";

import React, { useState, useMemo } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { mockAppointments } from '@/mock-data';
import { AppointmentStatusValue } from '@/types/hotel';
import Pagination from '@/components/tables/Pagination';
import PageMetadata from '@/components/common/PageMetadata';
import SearchFilter from '@/components/common/SearchFilter';
import { DashboardIcons, IconWrapper } from '@/components/common/icons';

// Constantes y mapeos
interface StatusConfig {
  label: string;
  color: string;
}

type SourceKey = 'app' | 'manual';
type StatusKey = AppointmentStatusValue;
type FilterKey = 'all' | StatusKey;
type SourceFilterKey = 'all' | SourceKey;

const STATUS_CONFIG: Record<StatusKey, StatusConfig> = {
  [AppointmentStatusValue.APPROVED]: { 
    label: 'Aprobado',
    color: 'bg-success-500 text-white'
  },
  [AppointmentStatusValue.REQUESTED]: {
    label: 'Solicitado',
    color: 'bg-warning-500 text-white'
  },
  [AppointmentStatusValue.CHECK_IN]: {
    label: 'Check-in',
    color: 'bg-blue-500 text-white'
  },
  [AppointmentStatusValue.CHECK_OUT]: {
    label: 'Check-out',
    color: 'bg-gray-500 text-white'
  },
  [AppointmentStatusValue.CANCELLED]: {
    label: 'Cancelado',
    color: 'bg-red-500 text-white'
  },
  [AppointmentStatusValue.OVERBOOKED]: {
    label: 'Sobrevendido',
    color: 'bg-gray-500 text-white'
  }
} as const;

const SOURCE_CONFIG: Record<SourceKey, string> = {
  app: 'Aplicación',
  manual: 'Manual'
} as const;

const TABLE_HEADERS = [
  { key: 'guest', label: 'Huésped', minWidth: '150px' },
  { key: 'room', label: 'Habitación', minWidth: '100px' },
  { key: 'checkIn', label: 'Check-in', minWidth: '120px' },
  { key: 'checkOut', label: 'Check-out', minWidth: '120px' },
  { key: 'status', label: 'Estado', minWidth: '100px' },
  { key: 'source', label: 'Fuente', minWidth: '100px' },
  { key: 'total', label: 'Total', minWidth: '100px' },
  { key: 'actions', label: 'Acciones', minWidth: 'auto' }
] as const;

// Componentes de tabla memoizados
const TableCell = React.memo(({ className, children }: { className?: string; children: React.ReactNode }) => (
  <td className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark ${className || ''}`}>
    {children}
  </td>
));
TableCell.displayName = 'TableCell';

const GuestCell = React.memo(({ firstName, lastName, email }: { firstName: string; lastName: string; email: string }) => (
  <TableCell>
    <h5 className="font-medium text-black dark:text-white">
      {firstName} {lastName}
    </h5>
    <p className="text-sm">{email}</p>
  </TableCell>
));
GuestCell.displayName = 'GuestCell';

const RoomCell = React.memo(({ number, categoryName }: { number: number; categoryName: string }) => (
  <TableCell>
    <p className="text-black dark:text-white">{number}</p>
    <p className="text-sm">{categoryName}</p>
  </TableCell>
));
RoomCell.displayName = 'RoomCell';

const DateCell = React.memo(({ date }: { date: string }) => (
  <TableCell>
    <p className="text-black dark:text-white">
      {new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </p>
  </TableCell>
));
DateCell.displayName = 'DateCell';

const StatusCell = React.memo(({ status }: { status: StatusKey }) => (
  <TableCell>
    <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${STATUS_CONFIG[status].color}`}>
      {STATUS_CONFIG[status].label}
    </p>
  </TableCell>
));
StatusCell.displayName = 'StatusCell';

const SourceCell = React.memo(({ source }: { source: SourceKey }) => (
  <TableCell>
    <p className="text-black dark:text-white capitalize">
      {SOURCE_CONFIG[source]}
    </p>
  </TableCell>
));
SourceCell.displayName = 'SourceCell';

const TotalCell = React.memo(({ amount }: { amount: number }) => (
  <TableCell>
    <p className="text-black dark:text-white">
      ${amount.toFixed(2)}
    </p>
  </TableCell>
));
TotalCell.displayName = 'TotalCell';

const ActionsCell = React.memo(() => (
  <TableCell>
    <div className="flex items-center space-x-3.5">
      <button className="hover:text-primary" title="Ver detalles">
        <IconWrapper className="fill-current">
          <DashboardIcons.Search />
        </IconWrapper>
      </button>
      <button className="hover:text-primary" title="Eliminar reservación">
        <IconWrapper className="fill-current">
          <DashboardIcons.Alert />
        </IconWrapper>
      </button>
    </div>
  </TableCell>
));
ActionsCell.displayName = 'ActionsCell';

const ReservationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterKey>('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilterKey>('all');
  
  const itemsPerPage = 10;

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
    return [...filteredAppointments].sort((a, b) => 
      new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );
  }, [filteredAppointments]);

  // Paginar appointments
  const currentAppointments = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Opciones de los filtros
  const statusOptions = [
    { value: 'all' as const, label: 'Todos los Estados' },
    ...Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({
      value: value as StatusKey,
      label
    }))
  ];

  const sourceOptions = [
    { value: 'all' as const, label: 'Todas las Fuentes' },
    ...Object.entries(SOURCE_CONFIG).map(([value, label]) => ({
      value: value as SourceKey,
      label
    }))
  ];

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
              filterValue={statusFilter}
              onFilterChange={setStatusFilter}
              filterOptions={statusOptions}
              totalResults={filteredAppointments.length}
            />
            <div className="w-full sm:w-auto">
              <select
                className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as SourceFilterKey)}
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
            <button className="flex items-center gap-2 rounded-md bg-primary py-2 px-4.5 font-medium text-white hover:bg-opacity-80">
              <IconWrapper className="fill-white">
                <DashboardIcons.Alert />
              </IconWrapper>
              Nueva Reservación
            </button>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  {TABLE_HEADERS.map(header => (
                    <th 
                      key={header.key}
                      className={`${header.minWidth ? `min-w-[${header.minWidth}]` : ''} py-4 px-4 font-medium text-black dark:text-white`}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appointment) => (
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
                    <StatusCell status={appointment.status.value as StatusKey} />
                    <SourceCell source={appointment.source as SourceKey} />
                    <TotalCell amount={appointment.totalPrice} />
                    <ActionsCell />
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
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default ReservationsPage;