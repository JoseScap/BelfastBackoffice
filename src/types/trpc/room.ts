import { z } from 'zod';
import { t } from '@/types/trpc/common';

// Definir el router de habitaciones
export const roomRouter = t.router({
  create: t.procedure
    .input(
      z.object({
        number: z.number().int(),
        floor: z.string().min(1).max(32),
        sector: z.string().optional(),
        categoryId: z.string(),
        statusValue: z.string(),
      })
    )
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
  getByFilter: t.procedure
    .input(
      z.object({
        filter: z.object({
          floor: z.string().optional(),
          sector: z.string().optional(),
          categoryId: z.string().optional(),
        }),
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
  getAllFloors: t.procedure
    .input(
      z.object({
        deleted: z.boolean(),
      })
    )
    .query(async () => {
      throw new Error('Not implemented');
    }),
  getAllSectors: t.procedure
    .input(
      z.object({
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
        number: z.number().int().optional(),
        floor: z.string().min(1).max(32).optional(),
        sector: z.string().optional(),
        categoryId: z.string().optional(),
        statusValue: z.string().optional(),
      })
    )
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
  updateStatus: t.procedure
    .input(
      z.object({
        id: z.string(),
        statusValue: z.string(),
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
