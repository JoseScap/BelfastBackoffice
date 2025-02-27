'use client';

import React, { useMemo } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { mockAppointments, mockRooms } from '@/mock-data';
import { RoomStatusValue, APPOINTMENT_STATUS, ROOM_STATUS } from '@/types/hotel';
import PageMetadata from '@/components/common/PageMetadata';
import StatCard from '@/components/common/StatCard';
import QuickLinkCard from '@/components/common/QuickLinkCard';
import { DashboardIcons, IconWrapper } from '@/components/common/icons';
import { getRoomStatusConfig } from '@/utils/statusColors';

const HotelManagementDashboard = () => {
  // Funciones de utilidad para fechas
  const isSameDay = (date1: string | Date, date2: Date = new Date()) => {
    const d1 = new Date(date1);
    return d1.toDateString() === date2.toDateString();
  };

  // Memoizar los conteos de appointments para evitar recálculos innecesarios
  const appointmentCounts = useMemo(() => {
    return {
      checkIns: mockAppointments.filter(
        appointment =>
          appointment.status.value === APPOINTMENT_STATUS.APPROVED &&
          isSameDay(appointment.checkInDate)
      ).length,

      checkOuts: mockAppointments.filter(
        appointment =>
          appointment.status.value === APPOINTMENT_STATUS.CHECK_IN &&
          isSameDay(appointment.checkOutDate)
      ).length,

      pending: mockAppointments.filter(
        appointment => appointment.status.value === APPOINTMENT_STATUS.REQUESTED
      ).length,
    };
  }, []);

  // Memoizar los conteos de habitaciones por estado
  const roomCounts = useMemo(() => {
    const counts = mockRooms.reduce((acc, room) => {
      const status = room.status.value;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<RoomStatusValue, number>);

    return {
      available: counts[ROOM_STATUS.AVAILABLE] || 0,
      cleaning: counts[ROOM_STATUS.CLEANING] || 0,
      maintenance: counts[ROOM_STATUS.MAINTENANCE] || 0,
      unavailable: counts[ROOM_STATUS.UNAVAILABLE] || 0,
    };
  }, []);

  // Definir las tarjetas de estadísticas
  const statCards = [
    {
      title: 'Check-ins de Hoy',
      value: appointmentCounts.checkIns,
      icon: (
        <IconWrapper className="fill-primary dark:fill-white">
          <DashboardIcons.CheckIn />
        </IconWrapper>
      ),
    },
    {
      title: 'Check-outs de Hoy',
      value: appointmentCounts.checkOuts,
      icon: (
        <IconWrapper className="fill-primary dark:fill-white">
          <DashboardIcons.CheckOut />
        </IconWrapper>
      ),
    },
    {
      title: 'Reservas Pendientes',
      value: appointmentCounts.pending,
      icon: (
        <IconWrapper className="fill-primary dark:fill-white">
          <DashboardIcons.Calendar />
        </IconWrapper>
      ),
    },
    {
      title: 'Habitaciones Disponibles',
      value: roomCounts.available,
      icon: (
        <IconWrapper className="fill-primary dark:fill-white">
          <DashboardIcons.Bed />
        </IconWrapper>
      ),
    },
  ];

  // Definir los enlaces rápidos
  const quickLinks = [
    {
      title: 'Gestión de Habitaciones',
      description: 'Administrar habitaciones y categorías',
      path: '/hotel-management/rooms',
      icon: (
        <IconWrapper className="fill-primary dark:fill-white mx-auto">
          <DashboardIcons.Hotel />
        </IconWrapper>
      ),
      showRoomStats: true,
    },
    {
      title: 'Reservas',
      description: 'Gestionar reservas y check-ins',
      path: '/hotel-management/reservations',
      icon: (
        <IconWrapper className="fill-primary dark:fill-white mx-auto">
          <DashboardIcons.Reservations />
        </IconWrapper>
      ),
      showRoomStats: false,
    },
    {
      title: 'Cuadrícula de Habitaciones',
      description: 'Ver calendario de disponibilidad',
      path: '/hotel-management/room-grid',
      icon: (
        <IconWrapper className="fill-primary dark:fill-white mx-auto">
          <DashboardIcons.List />
        </IconWrapper>
      ),
      showRoomStats: false,
    },
    {
      title: 'Solicitudes Pendientes',
      description: 'Gestionar solicitudes de reserva pendientes',
      path: '/hotel-management/pending',
      icon: (
        <IconWrapper className="fill-primary dark:fill-white mx-auto">
          <DashboardIcons.Pending />
        </IconWrapper>
      ),
      showRoomStats: false,
    },
  ];

  // Definir los estados de habitaciones para mostrar en las estadísticas
  const roomStats = [
    {
      status: ROOM_STATUS.AVAILABLE,
      count: roomCounts.available,
      label: 'Disponible',
      color: getRoomStatusConfig(ROOM_STATUS.AVAILABLE).background,
    },
    {
      status: ROOM_STATUS.CLEANING,
      count: roomCounts.cleaning,
      label: 'Limpieza',
      color: getRoomStatusConfig(ROOM_STATUS.CLEANING).background,
    },
    {
      status: ROOM_STATUS.MAINTENANCE,
      count: roomCounts.maintenance,
      label: 'Mantenimiento',
      color: getRoomStatusConfig(ROOM_STATUS.MAINTENANCE).background,
    },
    {
      status: ROOM_STATUS.UNAVAILABLE,
      count: roomCounts.unavailable,
      label: 'No Disponible',
      color: getRoomStatusConfig(ROOM_STATUS.UNAVAILABLE).background,
    },
  ];

  return (
    <>
      <PageMetadata
        title="Panel de Gestión Hotelera | Belfast Backoffice"
        description="Panel de control para la gestión hotelera de Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Panel de Gestión Hotelera" />

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Enlaces rápidos */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {quickLinks.map((link, index) => (
          <QuickLinkCard key={index} {...link} roomStats={link.showRoomStats ? roomStats : []} />
        ))}
      </div>
    </>
  );
};

export default HotelManagementDashboard;
