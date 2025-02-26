import { RoomStatus, RoomStatusValue } from '@/types/hotel';
import { v4 as uuidv4 } from 'uuid';

export const mockRoomStatuses: RoomStatus[] = [
  {
    id: uuidv4(),
    description: 'Room is being cleaned',
    value: RoomStatusValue.CLEANING,
  },
  {
    id: uuidv4(),
    description: 'Room is available for booking',
    value: RoomStatusValue.AVAILABLE,
  },
  {
    id: uuidv4(),
    description: 'Room is not available for booking',
    value: RoomStatusValue.UNAVAILABLE,
  },
  {
    id: uuidv4(),
    description: 'Room is under maintenance',
    value: RoomStatusValue.MAINTENANCE,
  },
]; 