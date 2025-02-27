import { RoomStatusValue, AppointmentStatusValue } from '@/types/hotel';

type StatusColorConfig = {
  background: string;
  text: string;
  border?: string;
};

// Configuración de colores para estados de habitaciones
export const ROOM_STATUS_COLORS: Record<RoomStatusValue, StatusColorConfig> = {
  Disponible: {
    background: 'bg-success-500',
    text: 'text-white',
    border: 'border-success-600',
  },
  'No Disponible': {
    background: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-600',
  },
  Limpieza: {
    background: 'bg-orange-500',
    text: 'text-white',
    border: 'border-orange-600',
  },
  Mantenimiento: {
    background: 'bg-blue-500',
    text: 'text-white',
    border: 'border-blue-600',
  },
} as const;

// Configuración de colores para estados de citas/reservas
export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatusValue, StatusColorConfig> = {
  Aprobado: {
    background: 'bg-success-500',
    text: 'text-white',
    border: 'border-success-600',
  },
  Solicitado: {
    background: 'bg-warning-500',
    text: 'text-white',
    border: 'border-warning-600',
  },
  'Check-in': {
    background: 'bg-blue-500',
    text: 'text-white',
    border: 'border-blue-600',
  },
  'Check-out': {
    background: 'bg-gray-500',
    text: 'text-white',
    border: 'border-gray-600',
  },
  Cancelado: {
    background: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-600',
  },
  Sobrevendido: {
    background: 'bg-gray-500',
    text: 'text-white',
    border: 'border-gray-600',
  },
} as const;

// Función helper para obtener las clases de color para un estado de habitación
export const getRoomStatusColors = (status: RoomStatusValue): string => {
  const config = ROOM_STATUS_COLORS[status];
  return `${config.background} ${config.text}`;
};

// Función helper para obtener las clases de color para un estado de cita/reserva
export const getAppointmentStatusColors = (status: AppointmentStatusValue): string => {
  const config = APPOINTMENT_STATUS_COLORS[status];
  return `${config.background} ${config.text}`;
};

// Función helper para obtener la configuración completa de colores
export const getRoomStatusConfig = (status: RoomStatusValue): StatusColorConfig => {
  return ROOM_STATUS_COLORS[status];
};

export const getAppointmentStatusConfig = (status: AppointmentStatusValue): StatusColorConfig => {
  return APPOINTMENT_STATUS_COLORS[status];
};
