import { Room } from '@/types/hotel';
import { v4 as uuidv4 } from 'uuid';
import { mockRoomCategories } from './roomCategories';
import { mockRoomStatuses } from './roomStatuses';

// Helper to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate 60 mock rooms (15 rooms per floor, 4 floors)
export const mockRooms: Room[] = Array.from({ length: 60 }, (_, index) => {
  const floor = Math.floor(index / 15) + 1; // 15 rooms per floor, 4 floors
  const roomNumber = floor * 100 + (index % 15) + 1; // Room numbers like 101, 102, ..., 115, 201, 202, etc.

  // Distribute room statuses more evenly
  let status;
  const statusIndex = index % 4; // 0, 1, 2, 3
  if (statusIndex === 0) {
    status = mockRoomStatuses[0]; // Cleaning
  } else if (statusIndex === 1) {
    status = mockRoomStatuses[1]; // Available
  } else if (statusIndex === 2) {
    status = mockRoomStatuses[2]; // Unavailable
  } else {
    status = mockRoomStatuses[3]; // Maintenance
  }

  return {
    id: uuidv4(),
    number: roomNumber,
    floor,
    capacity: Math.floor(Math.random() * 3) + 1, // 1-3 people
    beds: {
      single: Math.floor(Math.random() * 3), // 0-2 single beds
      double: Math.floor(Math.random() * 2), // 0-1 double beds
      queen: Math.floor(Math.random() * 2), // 0-1 queen beds
      king: Math.floor(Math.random() * 2), // 0-1 king beds
    },
    category: getRandomItem(mockRoomCategories),
    status: status,
  };
});
