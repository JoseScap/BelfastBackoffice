import { PendingAppointment } from '@/types/hotel';
import { v4 as uuidv4 } from 'uuid';
import { mockRoomCategories } from './roomCategories';
import { mockGuests } from './guests';

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

// Current date
const now = new Date();

// Generate 5 mock pending appointments
export const mockPendingAppointments: PendingAppointment[] = Array.from({ length: 5 }, () => {
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

  // Random room category and guest
  const roomCategory = getRandomItem(mockRoomCategories);
  const guest = getRandomItem(mockGuests);

  // Calculate total price based on room price and stay duration
  const stayDurationMs = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
  const stayDurationDays = Math.ceil(stayDurationMs / (1000 * 60 * 60 * 1000 * 24));
  const totalPrice = roomCategory.price * stayDurationDays;

  // TTL is 24 hours from creation
  const createdAt = getRandomDate(
    new Date(now.getTime() - 12 * 60 * 60 * 1000), // Up to 12 hours ago
    now
  );
  const ttl = new Date(new Date(createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString();

  return {
    id: uuidv4(),
    roomCategory,
    guest,
    checkInDate,
    checkOutDate,
    totalPrice,
    notes: Math.random() > 0.7 ? 'Special requests: early check-in if possible' : undefined,
    createdAt,
    updatedAt: createdAt,
    source: 'app', // All pending appointments come from the app
    ttl,
  };
}); 