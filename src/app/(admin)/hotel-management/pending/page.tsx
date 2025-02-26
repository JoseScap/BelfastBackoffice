"use client";

import React, { useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { mockAppointments } from '@/mock-data';
import { AppointmentStatusValue } from '@/types/hotel';
import Pagination from '@/components/tables/Pagination';
import PageMetadata from '@/components/common/PageMetadata';

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

  // Filter only pending appointments (REQUESTED status) and add priority
  const pendingAppointments = mockAppointments
    .filter(appointment => appointment.status.value === AppointmentStatusValue.REQUESTED)
    .map(appointment => {
      // Asignar prioridad basada en alguna lógica (por ejemplo, fecha de check-in)
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

  // Further filter based on search and priority
  const filteredAppointments = pendingAppointments.filter(appointment => {
    const matchesSearch = 
      appointment.guest.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.guest.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.room.number.toString().includes(searchTerm);
    
    const matchesPriority = priorityFilter === 'all' || appointment.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  // Sort appointments by priority (high first) and then by date
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    // First sort by priority
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (a.priority !== 'high' && b.priority === 'high') return 1;
    if (a.priority === 'medium' && b.priority === 'low') return -1;
    if (a.priority === 'low' && b.priority === 'medium') return 1;
    
    // Then sort by date (most recent first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Paginate appointments
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = sortedAppointments.slice(indexOfFirstItem, indexOfLastItem);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-orange-500 text-white';
      case 'low':
        return 'bg-success-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Calculate days since request
  const getDaysSinceRequest = (dateString: string) => {
    const requestDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - requestDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Traducir prioridad
  const translatePriority = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return priority;
    }
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar solicitudes..."
                className="w-full rounded-md border border-stroke bg-transparent py-2 pl-10 pr-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-2.5">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.9572 11.9572C12.2501 11.6643 12.7249 11.6643 13.0178 11.9572L16.2803 15.2197C16.5732 15.5126 16.5732 15.9874 16.2803 16.2803C15.9874 16.5732 15.5126 16.5732 15.2197 16.2803L11.9572 13.0178C11.6643 12.7249 11.6643 12.2501 11.9572 11.9572Z"
                    fill=""
                  />
                </svg>
              </span>
            </div>

            <div className="w-full sm:w-auto">
              <select
                className="w-full rounded-md border border-stroke bg-transparent py-2 px-4 outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark dark:focus:border-primary"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">Todas las Prioridades</option>
                <option value="high">Prioridad Alta</option>
                <option value="medium">Prioridad Media</option>
                <option value="low">Prioridad Baja</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredAppointments.length} solicitudes pendientes
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
          {/* High Priority */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prioridad Alta</span>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {pendingAppointments.filter(a => a.priority === 'high').length}
                </h4>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg
                  className="fill-danger"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9.62499V14.6667M11 19.25C6.44365 19.25 2.75 15.5563 2.75 11C2.75 6.44365 6.44365 2.75 11 2.75C15.5563 2.75 19.25 6.44365 19.25 11C19.25 15.5563 15.5563 19.25 11 19.25ZM11.0083 7.33333V7.33333Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Medium Priority */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prioridad Media</span>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {pendingAppointments.filter(a => a.priority === 'medium').length}
                </h4>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg
                  className="fill-warning"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9.62499V14.6667M11 19.25C6.44365 19.25 2.75 15.5563 2.75 11C2.75 6.44365 6.44365 2.75 11 2.75C15.5563 2.75 19.25 6.44365 19.25 11C19.25 15.5563 15.5563 19.25 11 19.25ZM11.0083 7.33333V7.33333Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Low Priority */}
          <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Prioridad Baja</span>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {pendingAppointments.filter(a => a.priority === 'low').length}
                </h4>
              </div>
              <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
                <svg
                  className="fill-success"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9.62499V14.6667M11 19.25C6.44365 19.25 2.75 15.5563 2.75 11C2.75 6.44365 6.44365 2.75 11 2.75C15.5563 2.75 19.25 6.44365 19.25 11C19.25 15.5563 15.5563 19.25 11 19.25ZM11.0083 7.33333V7.33333Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Requests Table */}
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Huésped
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Fecha de Solicitud
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Check-in
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Check-out
                  </th>
                  <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                    Tipo de Habitación
                  </th>
                  <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                    Prioridad
                  </th>
                  <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                    Espera
                  </th>
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <h5 className="font-medium text-black dark:text-white">
                        {appointment.guest.firstName} {appointment.guest.lastName}
                      </h5>
                      <p className="text-sm">{appointment.guest.email}</p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(appointment.createdAt)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(appointment.checkInDate)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {formatDate(appointment.checkOutDate)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {appointment.room.category.name}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getPriorityColor(
                          appointment.priority
                        )}`}
                      >
                        {translatePriority(appointment.priority)}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {getDaysSinceRequest(appointment.createdAt)} días
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button className="hover:text-success">
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.8754 11.6719C16.5379 11.6719 16.2285 11.9531 16.2285 12.3187V14.8219C16.2285 15.075 16.0316 15.2719 15.7785 15.2719H2.22227C1.96914 15.2719 1.77227 15.075 1.77227 14.8219V12.3187C1.77227 11.9812 1.49102 11.6719 1.12539 11.6719C0.759766 11.6719 0.478516 11.9531 0.478516 12.3187V14.8219C0.478516 15.7781 1.23789 16.5375 2.19414 16.5375H15.7785C16.7348 16.5375 17.4941 15.7781 17.4941 14.8219V12.3187C17.5223 11.9531 17.2129 11.6719 16.8754 11.6719Z"
                              fill=""
                            />
                            <path
                              d="M8.55074 12.3469C8.66324 12.4594 8.83199 12.5156 9.00074 12.5156C9.16949 12.5156 9.31012 12.4594 9.45074 12.3469L13.4726 8.43752C13.7257 8.1844 13.7257 7.79065 13.5007 7.53752C13.2476 7.2844 12.8539 7.2844 12.6007 7.5094L9.64762 10.4063V2.1094C9.64762 1.7719 9.36637 1.46252 9.00074 1.46252C8.66324 1.46252 8.35387 1.74377 8.35387 2.1094V10.4063L5.40074 7.53752C5.14762 7.2844 4.75387 7.31252 4.50074 7.53752C4.24762 7.79065 4.27574 8.1844 4.50074 8.43752L8.55074 12.3469Z"
                              fill=""
                            />
                          </svg>
                        </button>
                        <button className="hover:text-danger">
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                              fill=""
                            />
                            <path
                              d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                              fill=""
                            />
                            <path
                              d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                              fill=""
                            />
                            <path
                              d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                              fill=""
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredAppointments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </>
  );
};

export default PendingRequestsPage; 