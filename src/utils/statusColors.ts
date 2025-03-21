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

// Constantes de categorías
export const ROOM_CATEGORIES = {
  SENIOR_DOUBLE: 'Senior Double',
  SENIOR_QUEEN: 'Senior Queen',
  SENIOR_KING: 'Senior King',
  SIMPLE_FAMILY: 'Simple Family (Double + One)',
  SENIOR_FAMILY: 'Senior Family (Double + One)',
  SIMPLE_ONE: 'Simple One',
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

// Configuración de colores para categorías de habitaciones
export const CATEGORY_COLORS: Record<string, StatusColorConfig> = {
  [ROOM_CATEGORIES.SENIOR_DOUBLE]: {
    background: 'bg-blue-500',
    text: 'text-white',
    border: 'border-blue-600',
  },
  [ROOM_CATEGORIES.SENIOR_QUEEN]: {
    background: 'bg-yellow-500',
    text: 'text-white',
    border: 'border-yellow-600',
  },
  [ROOM_CATEGORIES.SENIOR_KING]: {
    background: 'bg-indigo-500',
    text: 'text-white',
    border: 'border-indigo-600',
  },
  [ROOM_CATEGORIES.SIMPLE_FAMILY]: {
    background: 'bg-red-500',
    text: 'text-white',
    border: 'border-red-600',
  },
  [ROOM_CATEGORIES.SENIOR_FAMILY]: {
    background: 'bg-emerald-500',
    text: 'text-white',
    border: 'border-emerald-600',
  },
  [ROOM_CATEGORIES.SIMPLE_ONE]: {
    background: 'bg-orange-500',
    text: 'text-white',
    border: 'border-orange-600',
  },
  default: {
    background: 'bg-cyan-500',
    text: 'text-white',
    border: 'border-cyan-600',
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

// Función helper para obtener la configuración de color de una categoría
export const getCategoryConfig = (categoryName: string | undefined): StatusColorConfig => {
  if (!categoryName) return CATEGORY_COLORS.default;

  // Buscar coincidencia exacta
  if (categoryName in CATEGORY_COLORS) {
    return CATEGORY_COLORS[categoryName];
  }

  // Si no hay coincidencia exacta, buscar por tipo de habitación
  const normalizedName = categoryName.toLowerCase();

  if (normalizedName.includes('senior double'))
    return CATEGORY_COLORS[ROOM_CATEGORIES.SENIOR_DOUBLE];
  if (normalizedName.includes('senior queen')) return CATEGORY_COLORS[ROOM_CATEGORIES.SENIOR_QUEEN];
  if (normalizedName.includes('senior king')) return CATEGORY_COLORS[ROOM_CATEGORIES.SENIOR_KING];
  if (normalizedName.includes('simple family'))
    return CATEGORY_COLORS[ROOM_CATEGORIES.SIMPLE_FAMILY];
  if (normalizedName.includes('senior family'))
    return CATEGORY_COLORS[ROOM_CATEGORIES.SENIOR_FAMILY];
  if (normalizedName.includes('simple one')) return CATEGORY_COLORS[ROOM_CATEGORIES.SIMPLE_ONE];

  return CATEGORY_COLORS.default;
};

// Función helper para obtener las clases de color de una categoría
export const getCategoryColors = (categoryName: string | undefined): string => {
  const config = getCategoryConfig(categoryName);
  return `${config.background} ${config.text}`;
};
