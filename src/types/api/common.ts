import { z } from 'zod';

// Schemas de validación
export const actionResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// Tipos inferidos
export type ActionResponse = z.infer<typeof actionResponseSchema>;
