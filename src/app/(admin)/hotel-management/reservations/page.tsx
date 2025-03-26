'use client';

import React, { useState, useMemo } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { AppointmentStatusValue, APPOINTMENT_STATUS } from '@/types/hotel';
import Pagination from '@/components/tables/Pagination';
import PageMetadata from '@/components/common/PageMetadata';
import SearchFilter from '@/components/common/SearchFilter';
import {
  GuestCell,
  RoomCell,
  DateCell,
  AppointmentStatusCell,
  SourceCell,
  PriceCell,
  ActionsCell,
} from '@/components/tables/TableCells';
import { trpcClient } from '@/api/trpc/client';
import type {
  ListReservationsByStatusResponse,
  ReservationStatusResponse,
} from '@/types/api/reservation';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import { BsCalendarPlus } from 'react-icons/bs';
import { AddReservationModal } from '@/components/modals/AddReservationModal';
import type { ReservationFormData } from '@/components/modals/AddReservationModal';
import ViewReservationModal from '@/components/modals/ViewReservationModal';

// Constants
const ITEMS_PER_PAGE = 10;

const SOURCE_OPTIONS = [
  { value: 'all', label: 'Todas las Fuentes' },
  { value: 'app', label: 'Aplicación' },
  { value: 'manual', label: 'Manual' },
];

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

// Types
type SourceKey = 'app' | 'manual';
type SourceFilterKey = 'all' | SourceKey;

// Utility functions
const mapApiStatusToUiStatus = (apiStatus: string): AppointmentStatusValue => {
  const statusMap: Record<string, AppointmentStatusValue> = {
    PENDING: APPOINTMENT_STATUS.REQUESTED,
    APPROVED: APPOINTMENT_STATUS.APPROVED,
    CHECKED_IN: APPOINTMENT_STATUS.CHECK_IN,
    CHECKED_OUT: APPOINTMENT_STATUS.CHECK_OUT,
    CANCELED: APPOINTMENT_STATUS.CANCELLED,
    OVERBOOKED: APPOINTMENT_STATUS.OVERBOOKED,
  };

  return statusMap[apiStatus] || APPOINTMENT_STATUS.REQUESTED;
};

const mapApiSourceToUiSource = (apiSource: string): string =>
  ({
    APP: 'Aplicación',
    BACKOFFICE: 'Manual',
    WEBSITE: 'Sitio Web',
    BOOKING: 'Booking',
    WHATSAPP: 'WhatsApp',
    OTHER_PORTAL: 'Otro Portal',
    OTHERS: 'Otros',
  }[apiSource] || apiSource);

const normalizeText = (text: string) => text.toLowerCase().trim();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const searchInPassengers = (passengers: any[], searchTerm: string) => {
  const search = normalizeText(searchTerm);
  return passengers.some(
    passenger =>
      normalizeText(passenger.firstName).includes(search) ||
      normalizeText(passenger.lastName).includes(search) ||
      normalizeText(`${passenger.firstName} ${passenger.lastName}`).includes(search) ||
      normalizeText(passenger.email).includes(search)
  );
};

const ReservationsPage = () => {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState<SourceFilterKey>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState<ListReservationsByStatusResponse[]>([]);
  const [statuses, setStatuses] = useState<ReservationStatusResponse[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<ListReservationsByStatusResponse | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Data fetching
  React.useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const data = await trpcClient.reservations.getAllStatuses.query();
        setStatuses(data);
      } catch (error) {
        console.error('Error fetching statuses:', error);
        toast.error('Error al cargar los estados');
      }
    };

    fetchStatuses();
  }, []);

  // Initial fetch of reservations
  React.useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const data = await trpcClient.reservations.list.query({});
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast.error('Error al cargar las reservaciones');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Memoized values
  const filteredReservations = useMemo(() => {
    if (!reservations?.length) return [];

    return reservations
      .filter(reservation => {
        if (!searchTerm) return true;

        const search = normalizeText(searchTerm);

        // Search by reservation ID
        if (reservation.id.toLowerCase().includes(search)) return true;

        // Search in all passengers
        if (searchInPassengers(reservation.passengers, searchTerm)) return true;

        // Search in category name
        if (normalizeText(reservation.category.name).includes(search)) return true;

        return false;
      })
      .filter(reservation => {
        // Status filter
        const matchesStatus = statusFilter === 'all' || reservation.status.value === statusFilter;

        // Source filter
        const matchesSource =
          sourceFilter === 'all' || reservation.source.toLowerCase() === sourceFilter;

        return matchesStatus && matchesSource;
      });
  }, [reservations, searchTerm, statusFilter, sourceFilter]);

  const sortedReservations = useMemo(
    () =>
      [...filteredReservations].sort(
        (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
      ),
    [filteredReservations]
  );

  const currentReservations = useMemo(
    () =>
      sortedReservations.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [sortedReservations, currentPage]
  );

  const statusOptions = useMemo(
    () => [
      { value: 'all', label: 'Todos los Estados' },
      ...(statuses?.map(status => ({
        value: status.value,
        label: status.value,
      })) || []),
    ],
    [statuses]
  );

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sourceFilter]);

  const handleCreateReservation = async (data: ReservationFormData) => {
    try {
      await trpcClient.reservations.create.mutate({
        checkInDate: data.checkInDate,
        checkInTime: data.checkInTime,
        checkOutDate: data.checkOutDate,
        checkOutTime: data.checkOutTime,
        categoryId: data.categoryId,
        roomId: data.roomId,
        mainPassenger: data.passengers[0],
        additionalPassengers: data.passengers.slice(1),
        source: data.source,
        status: data.status,
        notes: data.notes,
        appliedDiscount: data.appliedDiscount,
      });

      toast.success('Reservación creada exitosamente');
      setIsAddModalOpen(false);

      // Refetch reservations
      const updatedReservations = await trpcClient.reservations.list.query({});
      setReservations(updatedReservations);
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error('Error al crear la reservación');
    }
  };

  const handleViewReservation = (reservation: ListReservationsByStatusResponse) => {
    setSelectedReservation(reservation);
    setIsViewModalOpen(true);
  };

  const handleRefetchReservations = async () => {
    try {
      const updatedReservations = await trpcClient.reservations.list.query({});
      setReservations(updatedReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Error al actualizar la lista de reservaciones');
    }
  };

  return (
    <>
      <PageMetadata
        title="Reservas | Belfast Backoffice"
        description="Gestión de reservaciones para Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Reservas" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={[
              {
                id: 'status',
                label: 'Estado',
                value: statusFilter,
                onChange: value => setStatusFilter(value),
                options: statusOptions,
              },
              {
                id: 'source',
                label: 'Fuente',
                value: sourceFilter,
                onChange: value => setSourceFilter(value as SourceFilterKey),
                options: SOURCE_OPTIONS,
              },
            ]}
            totalResults={filteredReservations.length}
          />

          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              startIcon={<BsCalendarPlus size={16} />}
            >
              Nueva Reserva
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
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
                  {currentReservations.map(reservation => (
                    <tr key={reservation.id}>
                      <GuestCell
                        firstName={reservation.passengers[0].firstName}
                        lastName={reservation.passengers[0].lastName}
                        email={reservation.passengers[0].email}
                      />
                      <RoomCell
                        number={parseInt(reservation.category.id)}
                        categoryName={reservation.category.name}
                      />
                      <DateCell date={reservation.checkInDate} />
                      <DateCell date={reservation.checkOutDate} />
                      <AppointmentStatusCell
                        status={mapApiStatusToUiStatus(reservation.status.value)}
                      />
                      <SourceCell label={mapApiSourceToUiSource(reservation.source)} />
                      <PriceCell amount={reservation.appliedDiscount} />
                      <ActionsCell
                        onView={() => handleViewReservation(reservation)}
                        onDelete={() => console.log('Eliminar reservación:', reservation.id)}
                      />
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Pagination
            currentPage={currentPage}
            totalItems={sortedReservations.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <ViewReservationModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        reservation={selectedReservation}
        onUpdate={handleRefetchReservations}
      />

      <AddReservationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateReservation}
      />
    </>
  );
};

export default ReservationsPage;
