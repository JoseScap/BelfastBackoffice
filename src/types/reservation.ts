export type ReservationSource =
  | 'BACKOFFICE'
  | 'APP'
  | 'WEBSITE'
  | 'BOOKING'
  | 'WHATSAPP'
  | 'OTHER_PORTAL'
  | 'OTHERS';
export type ReservationStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'CANCELED'
  | 'OVERBOOKED';

export interface Passenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  age: number;
}

export interface ReservationFormData {
  // Step 1: Dates and Category
  checkInDate: string;
  checkInTime: string;
  checkOutDate: string;
  checkOutTime: string;
  categoryId: string;
  roomId: string;

  // Step 2: Passenger Data
  passengers: Passenger[];

  // Step 3: Additional Data
  source: ReservationSource;
  status: ReservationStatus;
  notes: string;
  appliedDiscount: number;
}

export interface ReservationFilters {
  status?: ReservationStatus;
  source?: ReservationSource;
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export type SourceFilterKey = 'all' | ReservationSource;
