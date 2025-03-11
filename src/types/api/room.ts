import { z } from 'zod';
import { roomCategorySchema } from './roomCategory';
import { roomStatusSchema } from './roomStatus';

// Schemas de validación
export const roomSchema = z.object({
  id: z.string(),
  number: z.number(),
  floor: z.string(),
  sector: z.string().nullable(),
  category: z.lazy(() => roomCategorySchema),
  status: z.lazy(() => roomStatusSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

// Tipos inferidos
export type RoomResponse = z.infer<typeof roomSchema>;

export type CreateRoomInput = {
  number: number;
  floor: string;
  sector?: string;
  categoryId: string;
  statusValue: string;
};

export type UpdateRoomInput = {
  id: string;
  number?: number;
  floor?: string;
  sector?: string;
  categoryId?: string;
  statusValue?: string;
};

export type UpdateRoomStatusInput = {
  id: string;
  statusValue: string;
};

export type DeleteRoomInput = {
  id: string;
};

export type RestoreRoomInput = {
  id: string;
};

export type GetRoomsByFilterInput = {
  filter: {
    floor?: string;
    sector?: string;
    categoryId?: string;
  };
  deleted: boolean;
};

export type GetRoomByIdInput = {
  id: string;
  deleted: boolean;
};

export type GetAllFloorsInput = {
  deleted: boolean;
};

export type GetAllSectorsInput = {
  deleted: boolean;
};
