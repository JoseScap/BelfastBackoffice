// Hotel Management Types

// Room Categories
export type RoomCategory = {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
};

// TODO: Add Room Type

// Room Status
export type RoomStatusValue = 'Limpieza' | 'Disponible' | 'No Disponible' | 'Mantenimiento';

export type RoomStatus = {
  id: string;
  description: string;
  value: RoomStatusValue;
};

// Rooms
export type Room = {
  id: string;
  number: number;
  floor: number;
  capacity: number;
  beds: {
    single: number;
    double: number;
    queen: number;
    king: number;
  };
  category: RoomCategory;
  status: RoomStatus;
};

// Appointment Status
export type AppointmentStatusValue =
  | 'Aprobado'
  | 'Solicitado'
  | 'Check-in'
  | 'Check-out'
  | 'Cancelado'
  | 'Sobrevendido';

// Helper constants for type safety and autocompletion
export const ROOM_STATUS = {
  CLEANING: 'Limpieza' as RoomStatusValue,
  AVAILABLE: 'Disponible' as RoomStatusValue,
  UNAVAILABLE: 'No Disponible' as RoomStatusValue,
  MAINTENANCE: 'Mantenimiento' as RoomStatusValue,
} as const;

export const APPOINTMENT_STATUS = {
  APPROVED: 'Aprobado' as AppointmentStatusValue,
  REQUESTED: 'Solicitado' as AppointmentStatusValue,
  CHECK_IN: 'Check-in' as AppointmentStatusValue,
  CHECK_OUT: 'Check-out' as AppointmentStatusValue,
  CANCELLED: 'Cancelado' as AppointmentStatusValue,
  OVERBOOKED: 'Sobrevendido' as AppointmentStatusValue,
} as const;

export type AppointmentStatus = {
  id: string;
  description: string;
  value: AppointmentStatusValue;
};

// Guest information
export type Guest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
};

// Appointment/Reservation
export type Appointment = {
  id: string;
  room: Room;
  guest: Guest;
  checkInDate: string; // ISO date string
  checkOutDate: string; // ISO date string
  paymentDate?: string; // ISO date string
  status: AppointmentStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  source: 'app' | 'manual'; // Source of the reservation
};

// Pending Appointment (for reservations in process)
export type PendingAppointment = Omit<Appointment, 'room' | 'status'> & {
  roomCategory: RoomCategory;
  ttl: string; // ISO date string when this pending reservation expires
};
