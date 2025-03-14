// Tipos de modales por módulo
export type RoomModalType = 'ROOM_VIEW' | 'ROOM_EDIT' | 'ROOM_DELETE' | 'ROOM_CREATE';

export type BookingModalType =
  | 'BOOKING_VIEW'
  | 'BOOKING_EDIT'
  | 'BOOKING_DELETE'
  | 'BOOKING_CREATE';

export type GuestModalType = 'GUEST_VIEW' | 'GUEST_EDIT' | 'GUEST_DELETE' | 'GUEST_CREATE';

export type ServiceModalType =
  | 'SERVICE_VIEW'
  | 'SERVICE_EDIT'
  | 'SERVICE_DELETE'
  | 'SERVICE_CREATE';

export type CalendarModalType = 'CALENDAR_EVENT_CREATE' | 'CALENDAR_EVENT_EDIT';

// Tipo que engloba todos los tipos de modales de la aplicación
export type AppModalType =
  | RoomModalType
  | BookingModalType
  | GuestModalType
  | ServiceModalType
  | CalendarModalType
  | null;

// Interfaz para metadata adicional del modal si es necesario
export interface ModalMetadata {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  preventClose?: boolean;
}

// Tipo para el estado del modal
export interface ModalState {
  type: AppModalType;
  isOpen: boolean;
  metadata?: ModalMetadata;
}
