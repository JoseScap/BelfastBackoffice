import { RoomStatusValue, AppointmentStatusValue } from '@/types/hotel';

// Constantes de estados para UI
export const ROOM_STATUS = {
  AVAILABLE: 'Disponible',
  UNAVAILABLE: 'No Disponible',
  CLEANING: 'Limpieza',
  MAINTENANCE: 'Mantenimiento',
} as const;

export const APPOINTMENT_STATUS = {
  APPROVED: 'Aprobado',
  REQUESTED: 'Solicitado',
  CHECK_IN: 'Check-in',
  CHECK_OUT: 'Check-out',
  CANCELED: 'Cancelado',
  OVERSOLD: 'Sobrevendido',
} as const;

type StatusColorConfig = {
  background: string;
  text: string;
  border?: string;
};

// Configuración de colores para estados de habitaciones
export const ROOM_STATUS_COLORS: Record<RoomStatusValue, StatusColorConfig> = {
  [ROOM_STATUS.AVAILABLE]: {
    background: 'bg-success-500',
    text: 'text-white',
    border: 'border-success-600',
  },
  [ROOM_STATUS.UNAVAILABLE]: {
    background: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-600',
  },
  [ROOM_STATUS.CLEANING]: {
    background: 'bg-orange-500',
    text: 'text-white',
    border: 'border-orange-600',
  },
  [ROOM_STATUS.MAINTENANCE]: {
    background: 'bg-blue-500',
    text: 'text-white',
    border: 'border-blue-600',
  },
} as const;

// Configuración de colores para estados de citas/reservas
export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatusValue, StatusColorConfig> = {
  [APPOINTMENT_STATUS.APPROVED]: {
    background: 'bg-success-500',
    text: 'text-white',
    border: 'border-success-600',
  },
  [APPOINTMENT_STATUS.REQUESTED]: {
    background: 'bg-warning-500',
    text: 'text-white',
    border: 'border-warning-600',
  },
  [APPOINTMENT_STATUS.CHECK_IN]: {
    background: 'bg-blue-500',
    text: 'text-white',
    border: 'border-blue-600',
  },
  [APPOINTMENT_STATUS.CHECK_OUT]: {
    background: 'bg-gray-500',
    text: 'text-white',
    border: 'border-gray-600',
  },
  [APPOINTMENT_STATUS.CANCELED]: {
    background: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-600',
  },
  [APPOINTMENT_STATUS.OVERSOLD]: {
    background: 'bg-gray-500',
    text: 'text-white',
    border: 'border-gray-600',
  },
} as const;

// Mappers de estados del backend a UI
export const mapRoomStatusToUI = (backendStatus: string): RoomStatusValue => {
  const statusMap: Record<string, RoomStatusValue> = {
    AVAILABLE: ROOM_STATUS.AVAILABLE,
    UNAVAILABLE: ROOM_STATUS.UNAVAILABLE,
    CLEANING: ROOM_STATUS.CLEANING,
    MAINTENANCE: ROOM_STATUS.MAINTENANCE,
  };

  return statusMap[backendStatus] || ROOM_STATUS.AVAILABLE;
};

export const mapAppointmentStatusToUI = (backendStatus: string): AppointmentStatusValue => {
  const statusMap: Record<string, AppointmentStatusValue> = {
    APPROVED: APPOINTMENT_STATUS.APPROVED,
    REQUESTED: APPOINTMENT_STATUS.REQUESTED,
    CHECK_IN: APPOINTMENT_STATUS.CHECK_IN,
    CHECK_OUT: APPOINTMENT_STATUS.CHECK_OUT,
    CANCELED: APPOINTMENT_STATUS.CANCELED,
    OVERSOLD: APPOINTMENT_STATUS.OVERSOLD,
  };

  return statusMap[backendStatus] || APPOINTMENT_STATUS.REQUESTED;
};

// Funciones helper para obtener las clases de color
export const getRoomStatusColors = (status: RoomStatusValue): string => {
  const config = ROOM_STATUS_COLORS[status];
  return `${config.background} ${config.text}`;
};

export const getAppointmentStatusColors = (status: AppointmentStatusValue): string => {
  const config = APPOINTMENT_STATUS_COLORS[status];
  return `${config.background} ${config.text}`;
};

// Funciones helper para obtener la configuración completa de colores
export const getRoomStatusConfig = (status: RoomStatusValue): StatusColorConfig => {
  return ROOM_STATUS_COLORS[status];
};

export const getAppointmentStatusConfig = (status: AppointmentStatusValue): StatusColorConfig => {
  return APPOINTMENT_STATUS_COLORS[status];
};

// Mapper de estados de UI a backend
export const mapUIStatusToBackend = (uiStatus: RoomStatusValue): string => {
  const statusMap: Record<RoomStatusValue, string> = {
    [ROOM_STATUS.AVAILABLE]: 'AVAILABLE',
    [ROOM_STATUS.UNAVAILABLE]: 'UNAVAILABLE',
    [ROOM_STATUS.CLEANING]: 'CLEANING',
    [ROOM_STATUS.MAINTENANCE]: 'MAINTENANCE',
  };

  return statusMap[uiStatus] || 'AVAILABLE';
};

// Cache y función para generar colores de categoría
const categoryColorsCache: Record<string, string> = {};

/**
 * Genera un color hexadecimal único basado en el nombre de la categoría
 * @param categoryName Nombre de la categoría
 * @returns Color hexadecimal
 */
export const getCategoryColor = (categoryName: string): string => {
  if (!categoryColorsCache[categoryName]) {
    const hash = Array.from(categoryName).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    categoryColorsCache[categoryName] = `#${'00000'.substring(0, 6 - c.length)}${c}`;
  }
  return categoryColorsCache[categoryName];
};
