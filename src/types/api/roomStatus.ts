import { z } from 'zod';

// Schemas de validación
export const roomStatusSchema = z.object({
  id: z.string(),
  description: z.string(),
  value: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable(),
});

// Tipos inferidos
export type RoomStatusResponse = z.infer<typeof roomStatusSchema>;
