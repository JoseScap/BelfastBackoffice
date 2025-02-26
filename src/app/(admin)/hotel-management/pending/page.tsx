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
}

const PRIORITY_LEVELS: Record<string, PriorityLevel> = {
  high: { label: 'Alta', color: 'bg-red-500 text-white', title: 'Prioridad Alta' },
  medium: { label: 'Media', color: 'bg-orange-500 text-white', title: 'Prioridad Media' },
  low: { label: 'Baja', color: 'bg-success-500 text-white', title: 'Prioridad Baja' }
};

const TABLE_HEADERS = [
  { key: 'guest', label: 'Huésped', minWidth: '220px', extraClasses: 'xl:pl-11' },
  { key: 'room', label: 'Habitación', minWidth: '150px' },
  { key: 'checkIn', label: 'Check-in', minWidth: '120px' },
  { key: 'checkOut', label: 'Check-out', minWidth: '120px' },
  { key: 'priority', label: 'Prioridad', minWidth: '100px' },
  { key: 'actions', label: 'Acciones', minWidth: 'auto' }
];

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
];

// Movemos la metadata a un archivo separado
// export const metadata: Metadata = {
//   title: 'Pending Requests | Belfast Backoffice',
//   description: 'Manage pending hotel requests for Belfast Backoffice',
// };

// Definimos un tipo para extender los appointments con priority
type AppointmentWithPriority = typeof mockAppointments[0] & {
  priority: 'high' | 'medium' | 'low';
};

const PendingRequestsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  const itemsPerPage = 10;

  // Memoizar los appointments con prioridad
  const pendingAppointments = useMemo(() => {
    return mockAppointments
      .filter(appointment => appointment.status.value === AppointmentStatusValue.REQUESTED)
      .map(appointment => {
        const checkInDate = new Date(appointment.checkInDate);
        const today = new Date();
        const diffDays = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        let priority: 'high' | 'medium' | 'low';
        if (diffDays <= 3) {
          priority = 'high';
        } else if (diffDays <= 7) {
          priority = 'medium';
        } else {
          priority = 'low';
        }
        
        return {
          ...appointment,
          priority
        } as AppointmentWithPriority;
      });
  }, []);

  // Memoizar los conteos por prioridad
  const priorityCounts = useMemo(() => {
    return {
      high: pendingAppointments.filter(a => a.priority === 'high').length,
      medium: pendingAppointments.filter(a => a.priority === 'medium').length,
      low: pendingAppointments.filter(a => a.priority === 'low').length
    };
  }, [pendingAppointments]);

  // Memoizar los appointments filtrados
  const filteredAppointments = useMemo(() => {
    return pendingAppointments.filter(appointment => {
      const matchesSearch = 
        appointment.guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.room.number.toString().includes(searchTerm);
      
      const matchesPriority = priorityFilter === 'all' || appointment.priority === priorityFilter;
      
      return matchesSearch && matchesPriority;
    });
  }, [pendingAppointments, searchTerm, priorityFilter]);

  // Memoizar los appointments ordenados
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      // First sort by priority
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (a.priority !== 'high' && b.priority === 'high') return 1;
      if (a.priority === 'medium' && b.priority === 'low') return -1;
      if (a.priority === 'low' && b.priority === 'medium') return 1;
      
      // Then sort by date (most recent first)
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
    { value: 'all', label: 'Todas las Prioridades' },
    ...Object.entries(PRIORITY_LEVELS).map(([value, { title }]) => ({
      value,
      label: title
    }))
  ];

  // Utilidades
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_LEVELS[priority as keyof typeof PRIORITY_LEVELS]?.color || 'bg-gray-500 text-white';
  };

  const translatePriority = (priority: string) => {
    return PRIORITY_LEVELS[priority as keyof typeof PRIORITY_LEVELS]?.label || priority;
  };

  return (
    <>
      <PageMetadata 
        title="Solicitudes Pendientes | Belfast Backoffice"
        description="Gestionar solicitudes pendientes de hotel para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Solicitudes Pendientes" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {/* Header Actions */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterValue={priorityFilter}
          onFilterChange={setPriorityFilter}
          filterOptions={filterOptions}
          totalResults={filteredAppointments.length}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
          {Object.entries(PRIORITY_LEVELS).map(([priority, { title }]) => (
            <PriorityCard
              key={priority}
              title={title}
              count={priorityCounts[priority as keyof typeof priorityCounts]}
              priority={priority as 'high' | 'medium' | 'low'}
            />
          ))}
        </div>

        {/* Table */}
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
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {appointment.guest.firstName} {appointment.guest.lastName}
                      </h5>
                      <p className="text-sm">{appointment.guest.email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4">
                      <p className="text-black dark:text-white">#{appointment.room.number}</p>
                      <p className="text-sm">{appointment.room.category.name}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4">
                      <p className="text-black dark:text-white">{formatDate(appointment.checkInDate)}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4">
                      <p className="text-black dark:text-white">{formatDate(appointment.checkOutDate)}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4">
                      <p className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getPriorityColor(appointment.priority)}`}>
                        {translatePriority(appointment.priority)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4">
                      <div className="flex items-center space-x-3.5">
                        {TABLE_ACTIONS.map(action => (
                          <button key={action.key} className="hover:text-primary" title={action.title}>
                            <IconWrapper className="fill-current">
                              {action.icon}
                            </IconWrapper>
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
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