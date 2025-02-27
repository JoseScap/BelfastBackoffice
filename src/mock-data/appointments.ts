import { v4 as uuidv4 } from 'uuid';
import { addDays, subDays } from 'date-fns';
import { Appointment, APPOINTMENT_STATUS } from '@/types/hotel';
import { mockRooms } from './rooms';
import { mockGuests } from './guests';
import { mockAppointmentStatuses } from './appointmentStatuses';

// Helper function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to get a random date between start and end
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate mock appointments
export const mockAppointments: Appointment[] = [];

// Get today's date at midnight
const today = new Date();
today.setHours(0, 0, 0, 0);

// Generate appointments for the past 30 days and next 30 days
const pastStart = subDays(today, 30);
const futureEnd = addDays(today, 30);

// Generate 50 appointments
for (let i = 0; i < 50; i++) {
  // Randomly decide if this is a past or future appointment
  const isPast = Math.random() < 0.5;

  // Generate check-in and check-out dates
  let checkInDate: Date;
  let checkOutDate: Date;

  if (isPast) {
    checkInDate = getRandomDate(pastStart, today);
    checkOutDate = getRandomDate(checkInDate, today);
  } else {
    checkInDate = getRandomDate(today, futureEnd);
    checkOutDate = getRandomDate(checkInDate, futureEnd);
  }

  // Get random room and guest
  const room = getRandomItem(mockRooms);
  const guest = getRandomItem(mockGuests);

  // Determine status based on dates
  let status;
  if (isPast) {
    // For past reservations, use CHECK_OUT
    status = mockAppointmentStatuses.find(s => s.value === APPOINTMENT_STATUS.CHECK_OUT);
  } else {
    // For future reservations, randomly assign REQUESTED, APPROVED, or CANCELLED
    const futureStatuses = [
      APPOINTMENT_STATUS.REQUESTED,
      APPOINTMENT_STATUS.APPROVED,
      APPOINTMENT_STATUS.CANCELLED,
    ];
    const statusValue = getRandomItem(futureStatuses);
    status = mockAppointmentStatuses.find(s => s.value === statusValue);
  }

  // Calculate total price (random number of days * room price)
  const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = days * room.category.price;

  mockAppointments.push({
    id: uuidv4(),
    room,
    guest,
    checkInDate: checkInDate.toISOString(),
    checkOutDate: checkOutDate.toISOString(),
    paymentDate:
      status?.value === APPOINTMENT_STATUS.APPROVED ? checkInDate.toISOString() : undefined,
    status: status!,
    totalPrice,
    notes: Math.random() > 0.7 ? 'Some special requests for the stay' : undefined,
    createdAt: subDays(checkInDate, Math.floor(Math.random() * 10)).toISOString(),
    updatedAt: subDays(checkInDate, Math.floor(Math.random() * 5)).toISOString(),
    source: Math.random() > 0.5 ? 'app' : 'manual',
  });
}

// Sort appointments by check-in date
mockAppointments.sort(
  (a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
);
