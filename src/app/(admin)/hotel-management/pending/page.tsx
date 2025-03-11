'use client';

import React, { useState, useMemo } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { mockAppointments } from '@/mock-data';
import { APPOINTMENT_STATUS } from '@/types/hotel';
import Pagination from '@/components/tables/Pagination';
import PageMetadata from '@/components/common/PageMetadata';
import PriorityCard from '@/components/common/PriorityCard';
import SearchFilter from '@/components/common/SearchFilter';
import { DashboardIcons, IconWrapper } from '@/components/common/icons';
import { PriorityKey, PRIORITY_CONFIG, getPriorityConfig } from '@/utils/priorityConfig';
import { TableCell, GuestCell, RoomCell, DateCell } from '@/components/tables/TableCells';

const TABLE_HEADERS = [
  { key: 'guest', label: 'Huésped', minWidth: '220px', extraClasses: '' },
  { key: 'room', label: 'Habitación', minWidth: '150px', extraClasses: '' },
  { key: 'checkIn', label: 'Check-in', minWidth: '120px', extraClasses: '' },
  { key: 'checkOut', label: 'Check-out', minWidth: '120px', extraClasses: '' },
  { key: 'priority', label: 'Prioridad', minWidth: '100px', extraClasses: '' },
  { key: 'actions', label: 'Acciones', minWidth: 'auto', extraClasses: '' },
] as const;

const TABLE_ACTIONS = [
  {
    key: 'view',
    icon: <DashboardIcons.Search />,
    title: 'Ver detalles',
  },
  {
    key: 'delete',
    icon: <DashboardIcons.Alert />,
    title: 'Eliminar solicitud',
  },
] as const;

// Componentes específicos de esta página
const PriorityCell = React.memo(({ priority }: { priority: PriorityKey }) => {
  const { background, text, label } = getPriorityConfig(priority);
  return (
    <TableCell>
      <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${background} ${text}`}>
        {label}
      </p>
    </TableCell>
  );
});
PriorityCell.displayName = 'PriorityCell';

const ActionsCell = React.memo(() => (
  <TableCell>
    <div className="flex items-center space-x-3.5">
      {TABLE_ACTIONS.map(action => (
        <button key={action.key} className="hover:text-primary" title={action.title}>
          <IconWrapper className="fill-current">{action.icon}</IconWrapper>
        </button>
      ))}
    </div>
  </TableCell>
));
ActionsCell.displayName = 'ActionsCell';

const PendingRequestsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoizar datos procesados
  const { filteredAppointments, totalPages } = useMemo(() => {
    const itemsPerPage = 10;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Filtrar por término de búsqueda
    const filtered = mockAppointments
      .filter(appointment => appointment.status.value === APPOINTMENT_STATUS.REQUESTED)
      .filter(appointment => {
        const searchStr =
          `${appointment.guest.firstName} ${appointment.guest.lastName} ${appointment.guest.email}`.toLowerCase();
        return searchStr.includes(searchTerm.toLowerCase());
      });

    return {
      filteredAppointments: filtered.slice(startIndex, endIndex),
      totalPages: Math.ceil(filtered.length / itemsPerPage),
    };
  }, [currentPage, searchTerm]);

  return (
    <>
      <PageMetadata
        title="Solicitudes Pendientes | Belfast Backoffice"
        description="Gestión de solicitudes pendientes para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Solicitudes Pendientes" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
            <PriorityCard key={key} title={config.title} count={0} priority={key as PriorityKey} />
          ))}
        </div>

        {/* Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="p-4 sm:p-6 xl:p-7.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold text-black dark:text-white">
                  Solicitudes Pendientes
                </h4>
                <p className="mt-1 text-sm font-medium">
                  Solicitudes de reserva que requieren aprobación
                </p>
              </div>
              <SearchFilter<PriorityKey>
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterValue="high"
                onFilterChange={() => {}}
                filterOptions={[
                  { value: 'high', label: 'Alta' },
                  { value: 'medium', label: 'Media' },
                  { value: 'low', label: 'Baja' },
                ]}
              />
            </div>
          </div>

          <div className="border-t border-stroke px-4 pb-6 pt-4 dark:border-strokedark sm:px-6 xl:px-7.5">
            <div className="flex flex-col">
              <table className="w-full">
                <thead>
                  <tr className="grid rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
                    {TABLE_HEADERS.map(header => (
                      <th
                        key={header.key}
                        className="p-2.5 text-left"
                        style={{ minWidth: header.minWidth }}
                      >
                        <h5 className="font-medium uppercase xsm:text-base">{header.label}</h5>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map(appointment => (
                    <tr
                      key={appointment.id}
                      className="grid w-full border-b border-stroke dark:border-strokedark sm:grid-cols-6"
                    >
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
                      <PriorityCell priority="high" />
                      <ActionsCell />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredAppointments.length * 10}
                  itemsPerPage={10}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingRequestsPage;
