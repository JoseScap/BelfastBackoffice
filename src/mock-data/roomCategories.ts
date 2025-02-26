import { RoomCategory } from '@/types/hotel';
import { v4 as uuidv4 } from 'uuid';

export const mockRoomCategories: RoomCategory[] = [
  {
    id: uuidv4(),
    name: 'Standard',
    price: 100,
    description: 'Comfortable room with basic amenities',
    images: ['/images/rooms/standard-1.jpg', '/images/rooms/standard-2.jpg'],
  },
  {
    id: uuidv4(),
    name: 'Deluxe',
    price: 150,
    description: 'Spacious room with premium amenities and city view',
    images: ['/images/rooms/deluxe-1.jpg', '/images/rooms/deluxe-2.jpg'],
  },
  {
    id: uuidv4(),
    name: 'Suite',
    price: 250,
    description: 'Luxury suite with separate living area and panoramic views',
    images: ['/images/rooms/suite-1.jpg', '/images/rooms/suite-2.jpg'],
  },
  {
    id: uuidv4(),
    name: 'Family',
    price: 200,
    description: 'Spacious room ideal for families with children',
    images: ['/images/rooms/family-1.jpg', '/images/rooms/family-2.jpg'],
  },
  {
    id: uuidv4(),
    name: 'Executive',
    price: 300,
    description: 'Premium room with executive lounge access and business amenities',
    images: ['/images/rooms/executive-1.jpg', '/images/rooms/executive-2.jpg'],
  },
]; 