// Hotel Management Types

// Room Categories
export interface RoomCategory {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
}

// Room Status
export enum RoomStatusValue {
  CLEANING = 'Limpieza',
  AVAILABLE = 'Disponible',
  UNAVAILABLE = 'No Disponible',
  MAINTENANCE = 'Mantenimiento'
}

export interface RoomStatus {
  id: string;
  description: string;
  value: RoomStatusValue;
}

// Rooms
export interface Room {
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
}

// Appointment Status
export enum AppointmentStatusValue {
  REQUESTED = 'Solicitada',
  APPROVED = 'Aprobada',
  CHECK_IN = 'Check-in',
  CHECK_OUT = 'Check-out',
  CANCELLED = 'Cancelada',
  OVERBOOKED = 'Sobrevendida'
}

export interface AppointmentStatus {
  id: string;
  description: string;
  value: AppointmentStatusValue;
}

// Guest information
export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
}

// Appointment/Reservation
export interface Appointment {
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
}

// Pending Appointment (for reservations in process)
export interface PendingAppointment extends Omit<Appointment, 'room' | 'status'> {
  roomCategory: RoomCategory;
  ttl: string; // ISO date string when this pending reservation expires
} 