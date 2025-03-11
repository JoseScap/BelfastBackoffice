import { z } from 'zod';

// Schemas de validación
export const roomCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  capacity: z.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

// Tipos inferidos
export type RoomCategoryResponse = z.infer<typeof roomCategorySchema>;

export type CreateRoomCategoryInput = {
  name: string;
  description: string;
  capacity: number;
};

export type UpdateRoomCategoryInput = {
  id: string;
  name?: string;
  description?: string;
  capacity?: number;
};

export type DeleteRoomCategoryInput = {
  id: string;
};

export type RestoreRoomCategoryInput = {
  id: string;
};

export type GetAllRoomCategoriesInput = {
  deleted: boolean;
};

export type GetRoomCategoryByIdInput = {
  id: string;
  deleted: boolean;
};
