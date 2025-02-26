"use client";

import React from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Link from 'next/link';
import { mockAppointments, mockRooms } from '@/mock-data';
import { AppointmentStatusValue, RoomStatusValue } from '@/types/hotel';
import PageMetadata from '@/components/common/PageMetadata';

const HotelManagementDashboard = () => {
  // Count appointments by status
  const todayCheckIns = mockAppointments.filter(
    (appointment) => 
      appointment.status.value === AppointmentStatusValue.APPROVED && 
      new Date(appointment.checkInDate).toDateString() === new Date().toDateString()
  ).length;

  const todayCheckOuts = mockAppointments.filter(
    (appointment) => 
      appointment.status.value === AppointmentStatusValue.CHECK_IN && 
      new Date(appointment.checkOutDate).toDateString() === new Date().toDateString()
  ).length;

  const pendingReservations = mockAppointments.filter(
    (appointment) => appointment.status.value === AppointmentStatusValue.REQUESTED
  ).length;

  // Count rooms by status
  const availableRooms = mockRooms.filter(
    (room) => room.status.value === RoomStatusValue.AVAILABLE
  ).length;

  const cleaningRooms = mockRooms.filter(
    (room) => room.status.value === RoomStatusValue.CLEANING
  ).length;

  const maintenanceRooms = mockRooms.filter(
    (room) => room.status.value === RoomStatusValue.MAINTENANCE
  ).length;

  const unavailableRooms = mockRooms.filter(
    (room) => room.status.value === RoomStatusValue.UNAVAILABLE
  ).length;

  // Get status color
  const getStatusColor = (status: RoomStatusValue) => {
    switch (status) {
      case RoomStatusValue.AVAILABLE:
        return 'bg-success-500';
      case RoomStatusValue.UNAVAILABLE:
        return 'bg-red-500';
      case RoomStatusValue.CLEANING:
        return 'bg-orange-500';
      case RoomStatusValue.MAINTENANCE:
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <PageMetadata 
        title="Panel de Gestión Hotelera | Belfast Backoffice"
        description="Panel de control para la gestión hotelera de Belfast Backoffice"
      />
      <PageBreadcrumb pageTitle="Panel de Gestión Hotelera" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Today's Check-ins */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                fill=""
              />
              <path
                d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                fill=""
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {todayCheckIns}
              </h4>
              <span className="text-sm font-medium">Check-ins de Hoy</span>
            </div>
          </div>
        </div>

        {/* Today's Check-outs */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                fill=""
              />
              <path
                d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                fill=""
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {todayCheckOuts}
              </h4>
              <span className="text-sm font-medium">Check-outs de Hoy</span>
            </div>
          </div>
        </div>

        {/* Pending Reservations */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                fill=""
              />
              <path
                d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                fill=""
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {pendingReservations}
              </h4>
              <span className="text-sm font-medium">Reservas Pendientes</span>
            </div>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
            <svg
              className="fill-primary dark:fill-white"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3844C2.20003 21.0375 2.99066 21.3813 3.85003 21.3813H18.1157C18.975 21.3813 19.8 21.0031 20.35 20.3844C20.9 19.7656 21.2094 18.9063 21.1063 18.0469ZM19.2157 19.3531C18.9407 19.6625 18.5625 19.8344 18.15 19.8344H3.85003C3.43753 19.8344 3.05941 19.6625 2.78441 19.3531C2.50941 19.0438 2.37191 18.6313 2.44066 18.2188L4.12503 3.43751C4.19378 2.71563 4.81253 2.16563 5.56878 2.16563H16.4313C17.1532 2.16563 17.7719 2.71563 17.875 3.43751L19.5938 18.2531C19.6282 18.6656 19.4907 19.0438 19.2157 19.3531Z"
                fill=""
              />
              <path
                d="M14.3345 5.29375C13.922 5.39688 13.647 5.80938 13.7501 6.22188C13.7845 6.42813 13.8189 6.63438 13.8189 6.80625C13.8189 8.35313 12.547 9.625 11.0001 9.625C9.45327 9.625 8.1814 8.35313 8.1814 6.80625C8.1814 6.6 8.21577 6.42813 8.25015 6.22188C8.35327 5.80938 8.07827 5.39688 7.66577 5.29375C7.25327 5.19063 6.84077 5.46563 6.73765 5.87813C6.6689 6.1875 6.63452 6.49688 6.63452 6.80625C6.63452 9.2125 8.5939 11.1719 11.0001 11.1719C13.4064 11.1719 15.3658 9.2125 15.3658 6.80625C15.3658 6.49688 15.3314 6.1875 15.2626 5.87813C15.1595 5.46563 14.747 5.225 14.3345 5.29375Z"
                fill=""
              />
            </svg>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-title-md font-bold text-black dark:text-white">
                {availableRooms}
              </h4>
              <span className="text-sm font-medium">Habitaciones Disponibles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Links */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <Link href="/hotel-management/rooms">
          <div className="rounded-sm border border-stroke bg-white p-4 text-center shadow-default dark:border-strokedark dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <h3 className="text-title-md font-bold text-black dark:text-white">
              Gestión de Habitaciones
            </h3>
            <p className="mt-1 text-sm">Administrar habitaciones y categorías</p>
            <div className="mt-3 flex justify-center gap-2">
              <div className="flex items-center gap-1">
                <span className={`h-3 w-3 rounded-full ${getStatusColor(RoomStatusValue.AVAILABLE)}`}></span>
                <span className="text-xs">{availableRooms} Disponible</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`h-3 w-3 rounded-full ${getStatusColor(RoomStatusValue.CLEANING)}`}></span>
                <span className="text-xs">{cleaningRooms} Limpieza</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`h-3 w-3 rounded-full ${getStatusColor(RoomStatusValue.MAINTENANCE)}`}></span>
                <span className="text-xs">{maintenanceRooms} Mantenimiento</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`h-3 w-3 rounded-full ${getStatusColor(RoomStatusValue.UNAVAILABLE)}`}></span>
                <span className="text-xs">{unavailableRooms} No Disponible</span>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/hotel-management/reservations">
          <div className="rounded-sm border border-stroke bg-white p-4 text-center shadow-default dark:border-strokedark dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <h3 className="text-title-md font-bold text-black dark:text-white">
              Reservas
            </h3>
            <p className="mt-1 text-sm">Gestionar reservas y check-ins</p>
          </div>
        </Link>

        <Link href="/hotel-management/room-grid">
          <div className="rounded-sm border border-stroke bg-white p-4 text-center shadow-default dark:border-strokedark dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <h3 className="text-title-md font-bold text-black dark:text-white">
              Cuadrícula de Habitaciones
            </h3>
            <p className="mt-1 text-sm">Ver calendario de disponibilidad</p>
          </div>
        </Link>

        <Link href="/hotel-management/pending">
          <div className="rounded-sm border border-stroke bg-white p-4 text-center shadow-default dark:border-strokedark dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
            <h3 className="text-title-md font-bold text-black dark:text-white">
              Solicitudes Pendientes
            </h3>
            <p className="mt-1 text-sm">Gestionar solicitudes de reserva pendientes</p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default HotelManagementDashboard; 