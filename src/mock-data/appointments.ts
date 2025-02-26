import { Appointment, AppointmentStatusValue } from '@/types/hotel';
import { v4 as uuidv4 } from 'uuid';
import { mockRooms } from './rooms';
import { mockGuests } from './guests';
import { mockAppointmentStatuses } from './appointmentStatuses';

// Helper to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper to get random date within range
const getRandomDate = (start: Date, end: Date): string => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

// Helper to get status by value
const getStatusByValue = (value: AppointmentStatusValue) => {
  return mockAppointmentStatuses.find(status => status.value === value) || mockAppointmentStatuses[0];
};

// Current date
const now = new Date();

// Generate 30 mock appointments
export const mockAppointments: Appointment[] = Array.from({ length: 30 }, () => {
  // Random check-in date between today and 30 days from now
  const checkInDate = getRandomDate(
    now,
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30)
  );
  
  // Random check-out date between check-in and 7 days after check-in
  const checkInDateObj = new Date(checkInDate);
  const checkOutDate = getRandomDate(
    new Date(checkInDateObj.getTime() + 24 * 60 * 60 * 1000), // At least 1 day stay
    new Date(checkInDateObj.getTime() + 7 * 24 * 60 * 60 * 1000) // At most 7 days stay
  );

  // Random room and guest
  const room = getRandomItem(mockRooms);
  const guest = getRandomItem(mockGuests);

  // Determine status based on dates
  let status;
  const checkInTime = new Date(checkInDate).getTime();
  const checkOutTime = new Date(checkOutDate).getTime();
  const currentTime = now.getTime();

  if (currentTime > checkOutTime) {
    status = getStatusByValue(AppointmentStatusValue.CHECK_OUT);
  } else if (currentTime > checkInTime) {
    status = getStatusByValue(AppointmentStatusValue.CHECK_IN);
  } else {
    // For future reservations, randomly assign REQUESTED, APPROVED, or CANCELLED
    const futureStatuses = [
      AppointmentStatusValue.REQUESTED,
      AppointmentStatusValue.APPROVED,
      AppointmentStatusValue.CANCELLED,
    ];
    status = getStatusByValue(getRandomItem(futureStatuses));
  }

  // Calculate total price based on room price and stay duration
  const stayDurationMs = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
  const stayDurationDays = Math.ceil(stayDurationMs / (1000 * 60 * 60 * 24));
  const totalPrice = room.category.price * stayDurationDays;

  // Random source (70% app, 30% manual)
  const source = Math.random() < 0.7 ? 'app' : 'manual';

  return {
    id: uuidv4(),
    room,
    guest,
    checkInDate,
    checkOutDate,
    paymentDate: status.value !== AppointmentStatusValue.REQUESTED ? 
      getRandomDate(new Date(now.getFullYear(), now.getMonth() - 1), now) : 
      undefined,
    status,
    totalPrice,
    notes: Math.random() > 0.7 ? 'Special requests: late check-out requested' : undefined,
    createdAt: getRandomDate(new Date(now.getFullYear(), now.getMonth() - 2), now),
    updatedAt: getRandomDate(new Date(now.getFullYear(), now.getMonth() - 1), now),
    source,
  };
}); 