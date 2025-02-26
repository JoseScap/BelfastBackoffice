"use client";

import React, { useMemo } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Link from 'next/link';
import { mockAppointments, mockRooms } from '@/mock-data';
import { AppointmentStatusValue, RoomStatusValue } from '@/types/hotel';
import PageMetadata from '@/components/common/PageMetadata';
import { FaSignInAlt, FaSignOutAlt, FaCalendarCheck, FaBed } from 'react-icons/fa';

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
          appointment.status.value === AppointmentStatusValue.APPROVED && 
          isSameDay(appointment.checkInDate)
      ).length,

      checkOuts: mockAppointments.filter(
        appointment => 
          appointment.status.value === AppointmentStatusValue.CHECK_IN && 
          isSameDay(appointment.checkOutDate)
      ).length,

      pending: mockAppointments.filter(
        appointment => appointment.status.value === AppointmentStatusValue.REQUESTED
      ).length
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
      available: counts[RoomStatusValue.AVAILABLE] || 0,
      cleaning: counts[RoomStatusValue.CLEANING] || 0,
      maintenance: counts[RoomStatusValue.MAINTENANCE] || 0,
      unavailable: counts[RoomStatusValue.UNAVAILABLE] || 0
    };
  }, []);

  // Mapa de colores por estado
  const statusColorMap: Record<RoomStatusValue, string> = {
    [RoomStatusValue.AVAILABLE]: 'bg-success-500',
    [RoomStatusValue.UNAVAILABLE]: 'bg-red-500',
    [RoomStatusValue.CLEANING]: 'bg-orange-500',
    [RoomStatusValue.MAINTENANCE]: 'bg-blue-500'
  };

  // Definir las tarjetas de estadísticas
  const statCards = [
    {
      title: 'Check-ins de Hoy',
      value: appointmentCounts.checkIns,
      icon: <FaSignInAlt className="w-6 h-6 fill-primary dark:fill-white" />
    },
    {
      title: 'Check-outs de Hoy',
      value: appointmentCounts.checkOuts,
      icon: <FaSignOutAlt className="w-6 h-6 fill-primary dark:fill-white" />
    },
    {
      title: 'Reservas Pendientes',
      value: appointmentCounts.pending,
      icon: <FaCalendarCheck className="w-6 h-6 fill-primary dark:fill-white" />
    },
    {
      title: 'Habitaciones Disponibles',
      value: roomCounts.available,
      icon: <FaBed className="w-6 h-6 fill-primary dark:fill-white" />
    }
  ];

  // Definir los enlaces rápidos
  const quickLinks = [
    {
      title: 'Gestión de Habitaciones',
      description: 'Administrar habitaciones y categorías',
      path: '/hotel-management/rooms',
      showRoomStats: true
    },
    {
      title: 'Reservas',
      description: 'Gestionar reservas y check-ins',
      path: '/hotel-management/reservations',
      showRoomStats: false
    },
    {
      title: 'Cuadrícula de Habitaciones',
      description: 'Ver calendario de disponibilidad',
      path: '/hotel-management/room-grid',
      showRoomStats: false
    },
    {
      title: 'Solicitudes Pendientes',
      description: 'Gestionar solicitudes de reserva pendientes',
      path: '/hotel-management/pending',
      showRoomStats: false
    }
  ];

  // Definir los estados de habitaciones para mostrar en las estadísticas
  const roomStats = [
    { status: RoomStatusValue.AVAILABLE, count: roomCounts.available, label: 'Disponible' },
    { status: RoomStatusValue.CLEANING, count: roomCounts.cleaning, label: 'Limpieza' },
    { status: RoomStatusValue.MAINTENANCE, count: roomCounts.maintenance, label: 'Mantenimiento' },
    { status: RoomStatusValue.UNAVAILABLE, count: roomCounts.unavailable, label: 'No Disponible' }
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
          <div key={index} className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
              {card.icon}
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <h4 className="text-title-md font-bold text-black dark:text-white">
                  {card.value}
                </h4>
                <span className="text-sm font-medium">{card.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enlaces rápidos */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {quickLinks.map((link, index) => (
          <Link key={index} href={link.path}>
            <div className="rounded-sm h-full border border-stroke bg-white p-4 text-center shadow-default dark:border-strokedark dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <h3 className="text-title-md font-bold text-black dark:text-white">
                {link.title}
              </h3>
              <p className="mt-1 text-sm">{link.description}</p>
              
              {link.showRoomStats && (
                <div className="mt-3 flex flex-wrap px-10 justify-center gap-2">
                  {roomStats.map((stat, statIndex) => (
                    <div key={statIndex} className="flex items-center gap-1">
                      <span className={`h-3 w-3 rounded-full ${statusColorMap[stat.status]}`}></span>
                      <span className="text-xs">{stat.count} {stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default HotelManagementDashboard; 