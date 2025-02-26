import { AppointmentStatus, AppointmentStatusValue } from '@/types/hotel';
import { v4 as uuidv4 } from 'uuid';

export const mockAppointmentStatuses: AppointmentStatus[] = [
  {
    id: uuidv4(),
    description: 'Reservation has been requested',
    value: AppointmentStatusValue.REQUESTED,
  },
  {
    id: uuidv4(),
    description: 'Reservation has been approved',
    value: AppointmentStatusValue.APPROVED,
  },
  {
    id: uuidv4(),
    description: 'Guest has checked in',
    value: AppointmentStatusValue.CHECK_IN,
  },
  {
    id: uuidv4(),
    description: 'Guest has checked out',
    value: AppointmentStatusValue.CHECK_OUT,
  },
  {
    id: uuidv4(),
    description: 'Reservation has been cancelled',
    value: AppointmentStatusValue.CANCELLED,
  },
  {
    id: uuidv4(),
    description: 'Room was overbooked',
    value: AppointmentStatusValue.OVERBOOKED,
  },
]; 