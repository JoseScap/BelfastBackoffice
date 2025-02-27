import { Room } from '@/types/hotel';
import { v4 as uuidv4 } from 'uuid';
import { mockRoomCategories } from './roomCategories';
import { mockRoomStatuses } from './roomStatuses';

// Helper to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate 20 mock rooms
export const mockRooms: Room[] = Array.from({ length: 20 }, (_, index) => {
  const floor = Math.floor(index / 5) + 1; // 5 rooms per floor, 4 floors
  const roomNumber = floor * 100 + (index % 5) + 1; // Room numbers like 101, 102, 201, 202, etc.
  
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
    status: getRandomItem(mockRoomStatuses),
  };
}); 