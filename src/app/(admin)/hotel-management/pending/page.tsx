"use client";

import React, { useState, useMemo } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { mockAppointments } from '@/mock-data';
import { AppointmentStatusValue } from '@/types/hotel';
import Pagination from '@/components/tables/Pagination';
import PageMetadata from '@/components/common/PageMetadata';
import PriorityCard from '@/components/common/PriorityCard';
import SearchFilter from '@/components/common/SearchFilter';
import { DashboardIcons, IconWrapper } from '@/components/common/icons';

// Constantes y mapeos
interface PriorityLevel {
  label: string;
  color: string;
  title: string;
  order: number;
}

type PriorityKey = 'high' | 'medium' | 'low';

const PRIORITY_LEVELS: Record<PriorityKey, PriorityLevel> = {
  high: { label: 'Alta', color: 'bg-red-500 text-white', title: 'Prioridad Alta', order: 1 },
  medium: { label: 'Media', color: 'bg-orange-500 text-white', title: 'Prioridad Media', order: 2 },
  low: { label: 'Baja', color: 'bg-success-500 text-white', title: 'Prioridad Baja', order: 3 }
} as const;

const TABLE_HEADERS = [
  { key: 'guest', label: 'Huésped', minWidth: '220px', extraClasses: 'xl:pl-11' },
  { key: 'room', label: 'Habitación', minWidth: '150px', extraClasses: '' },
  { key: 'checkIn', label: 'Check-in', minWidth: '120px', extraClasses: '' },
  { key: 'checkOut', label: 'Check-out', minWidth: '120px', extraClasses: '' },
  { key: 'priority', label: 'Prioridad', minWidth: '100px', extraClasses: '' },
  { key: 'actions', label: 'Acciones', minWidth: 'auto', extraClasses: '' }
] as const;

const TABLE_ACTIONS = [
  {
    key: 'view',
    icon: <DashboardIcons.Search />,
    title: 'Ver detalles'
  },
  {
    key: 'delete',
    icon: <DashboardIcons.Alert />,
    title: 'Eliminar solicitud'
  }
] as const;

// Componentes de tabla memoizados
const TableCell = React.memo(({ className, children }: { className?: string; children: React.ReactNode }) => (
  <td className={`border-b border-[#eee] py-5 px-4 ${className || ''}`}>
    {children}
  </td>
));
TableCell.displayName = 'TableCell';

const GuestCell = React.memo(({ firstName, lastName, email }: { firstName: string; lastName: string; email: string }) => (
  <TableCell className="pl-9 xl:pl-11">
    <h5 className="font-medium text-black dark:text-white">
      {firstName} {lastName}
    </h5>
    <p className="text-sm">{email}</p>
  </TableCell>
));
GuestCell.displayName = 'GuestCell';

const RoomCell = React.memo(({ number, categoryName }: { number: number; categoryName: string }) => (
  <TableCell>
    <p className="text-black dark:text-white">#{number}</p>
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

const PriorityCell = React.memo(({ priority }: { priority: PriorityKey }) => (
  <TableCell>
    <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${PRIORITY_LEVELS[priority].color}`}>
      {PRIORITY_LEVELS[priority].label}
    </p>
  </TableCell>
));
PriorityCell.displayName = 'PriorityCell';

const ActionsCell = React.memo(() => (
  <TableCell>
    <div className="flex items-center space-x-3.5">
      {TABLE_ACTIONS.map(action => (
        <button key={action.key} className="hover:text-primary" title={action.title}>
          <IconWrapper className="fill-current">
            {action.icon}
          </IconWrapper>
        </button>
      ))}
    </div>
  </TableCell>
));
ActionsCell.displayName = 'ActionsCell';


const PendingRequestsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityKey>('all');
  
  const itemsPerPage = 10;

  // Memoizar los appointments con prioridad
  const pendingAppointments = useMemo(() => {
    return mockAppointments
      .filter(appointment => appointment.status.value === AppointmentStatusValue.REQUESTED)
      .map(appointment => {
        const checkInDate = new Date(appointment.checkInDate);
        const today = new Date();
        const diffDays = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let priority: PriorityKey;
        if (diffDays <= 3) priority = 'high';
        else if (diffDays <= 7) priority = 'medium';
        else priority = 'low';
        
        return { ...appointment, priority };
      });
  }, []);

  // Memoizar los conteos por prioridad
  const priorityCounts = useMemo(() => {
    return Object.fromEntries(
      (Object.keys(PRIORITY_LEVELS) as Array<PriorityKey>).map(priority => [
        priority,
        pendingAppointments.filter(a => a.priority === priority).length
      ])
    ) as Record<PriorityKey, number>;
  }, [pendingAppointments]);

  // Memoizar los appointments filtrados
  const filteredAppointments = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return pendingAppointments.filter(appointment => {
      const matchesSearch = 
        appointment.guest.firstName.toLowerCase().includes(searchLower) ||
        appointment.guest.lastName.toLowerCase().includes(searchLower) ||
        appointment.room.number.toString().includes(searchTerm);
      
      return matchesSearch && (priorityFilter === 'all' || appointment.priority === priorityFilter);
    });
  }, [pendingAppointments, searchTerm, priorityFilter]);

  // Memoizar los appointments ordenados
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      // Ordenar por prioridad usando el orden definido en PRIORITY_LEVELS
      const orderDiff = PRIORITY_LEVELS[a.priority].order - PRIORITY_LEVELS[b.priority].order;
      if (orderDiff !== 0) return orderDiff;
      
      // Si tienen la misma prioridad, ordenar por fecha más reciente
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredAppointments]);

  // Paginar appointments
  const currentAppointments = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Opciones del filtro
  const filterOptions = [
    { value: 'all' as const, label: 'Todas las Prioridades' },
    ...Object.entries(PRIORITY_LEVELS).map(([value, { title }]) => ({
      value: value as PriorityKey,
      label: title
    }))
  ];

  return (
    <>
      <PageMetadata 
        title="Solicitudes Pendientes | Belfast Backoffice"
        description="Gestionar solicitudes pendientes de hotel para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Solicitudes Pendientes" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <SearchFilter<'all' | PriorityKey>
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={priorityFilter}
          onFilterChange={setPriorityFilter}
          filterOptions={filterOptions}
          totalResults={filteredAppointments.length}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
          {(Object.entries(PRIORITY_LEVELS) as Array<[PriorityKey, PriorityLevel]>).map(([priority, { title }]) => (
            <PriorityCard
              key={priority}
              title={title}
              count={priorityCounts[priority]}
              priority={priority}
            />
          ))}
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  {TABLE_HEADERS.map(header => (
                    <th 
                      key={header.key}
                      className={`${header.minWidth ? `min-w-[${header.minWidth}]` : ''} py-4 px-4 font-medium text-black dark:text-white ${header.extraClasses || ''}`}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appointment, index) => (
                  <tr key={index}>
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
                    <PriorityCell priority={appointment.priority} />
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

export default PendingRequestsPage; 