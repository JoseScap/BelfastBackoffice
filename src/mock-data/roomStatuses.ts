import { v4 as uuidv4 } from 'uuid';
import { RoomStatus, ROOM_STATUS } from '@/types/hotel';

export const mockRoomStatuses: RoomStatus[] = [
  {
    id: uuidv4(),
    description: 'Room is being cleaned',
    value: ROOM_STATUS.CLEANING,
  },
  {
    id: uuidv4(),
    description: 'Room is available for booking',
    value: ROOM_STATUS.AVAILABLE,
  },
  {
    id: uuidv4(),
    description: 'Room is not available for booking',
    value: ROOM_STATUS.UNAVAILABLE,
  },
  {
    id: uuidv4(),
    description: 'Room is under maintenance',
    value: ROOM_STATUS.MAINTENANCE,
  },
];
