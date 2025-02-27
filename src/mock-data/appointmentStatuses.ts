import { v4 as uuidv4 } from 'uuid';
import { AppointmentStatus, APPOINTMENT_STATUS } from '@/types/hotel';

export const mockAppointmentStatuses: AppointmentStatus[] = [
  {
    id: uuidv4(),
    description: 'Reservation request is pending approval',
    value: APPOINTMENT_STATUS.REQUESTED,
  },
  {
    id: uuidv4(),
    description: 'Reservation has been approved',
    value: APPOINTMENT_STATUS.APPROVED,
  },
  {
    id: uuidv4(),
    description: 'Guest has checked in',
    value: APPOINTMENT_STATUS.CHECK_IN,
  },
  {
    id: uuidv4(),
    description: 'Guest has checked out',
    value: APPOINTMENT_STATUS.CHECK_OUT,
  },
  {
    id: uuidv4(),
    description: 'Reservation has been cancelled',
    value: APPOINTMENT_STATUS.CANCELLED,
  },
  {
    id: uuidv4(),
    description: 'Room was overbooked',
    value: APPOINTMENT_STATUS.OVERBOOKED,
  },
];
