import { AppointmentStatusValue, APPOINTMENT_STATUS } from '@/types/hotel';

export const SOURCE_OPTIONS = [
  { value: 'BACKOFFICE', label: 'Manual' },
  { value: 'APP', label: 'Aplicación' },
  { value: 'WEBSITE', label: 'Sitio Web' },
  { value: 'BOOKING', label: 'Booking' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'OTHER_PORTAL', label: 'Otro Portal' },
  { value: 'OTHERS', label: 'Otros' },
] as const;

export const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobada' },
  { value: 'CHECKED_IN', label: 'Check-in' },
  { value: 'CHECKED_OUT', label: 'Check-out' },
  { value: 'CANCELED', label: 'Cancelada' },
  { value: 'OVERBOOKED', label: 'Sobrevendida' },
] as const;

export const mapApiStatusToUiStatus = (apiStatus: string): AppointmentStatusValue => {
  const statusMap: Record<string, AppointmentStatusValue> = {
    PENDING: APPOINTMENT_STATUS.REQUESTED,
    APPROVED: APPOINTMENT_STATUS.APPROVED,
    CHECKED_IN: APPOINTMENT_STATUS.CHECK_IN,
    CHECKED_OUT: APPOINTMENT_STATUS.CHECK_OUT,
    CANCELED: APPOINTMENT_STATUS.CANCELLED,
    OVERBOOKED: APPOINTMENT_STATUS.OVERBOOKED,
  };

  return statusMap[apiStatus] || APPOINTMENT_STATUS.REQUESTED;
};

export const mapApiSourceToUiSource = (apiSource: string): string =>
  ({
    APP: 'Aplicación',
    BACKOFFICE: 'Manual',
    WEBSITE: 'Sitio Web',
    BOOKING: 'Booking',
    WHATSAPP: 'WhatsApp',
    OTHER_PORTAL: 'Otro Portal',
    OTHERS: 'Otros',
  }[apiSource] || apiSource);

export const formatDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateForInput = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
};

export const normalizeText = (text: string) => text.toLowerCase().trim();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const searchInPassengers = (passengers: any[], searchTerm: string) => {
  const search = normalizeText(searchTerm);
  return passengers.some(
    passenger =>
      normalizeText(passenger.firstName).includes(search) ||
      normalizeText(passenger.lastName).includes(search) ||
      normalizeText(`${passenger.firstName} ${passenger.lastName}`).includes(search) ||
      normalizeText(passenger.email).includes(search)
  );
};
