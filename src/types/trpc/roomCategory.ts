import { z } from 'zod';
import { t } from '@/types/trpc/common';

// Definir el router de categorías de habitaciones
export const roomCategoryRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        description: z.string().min(1),
        capacity: z.number().int().positive(),
      })
    )
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
  getAll: t.procedure
    .input(
      z.object({
        deleted: z.boolean(),
      })
    )
    .query(async () => {
      throw new Error('Not implemented');
    }),
  getById: t.procedure
    .input(
      z.object({
        id: z.string(),
        deleted: z.boolean(),
      })
    )
    .query(async () => {
      throw new Error('Not implemented');
    }),
  update: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        capacity: z.number().int().positive().optional(),
      })
    )
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
  delete: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
  restore: t.procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
});
