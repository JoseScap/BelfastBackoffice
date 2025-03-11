import { z } from 'zod';
// Eliminamos la importación redundante de initTRPC
// import { initTRPC } from '@trpc/server';

// Importamos el t desde un archivo común para mantener la misma instancia
import { t } from '@/types/trpc/common';

// Definir el router de autenticación
export const authRouter = t.router({
  login: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
  register: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string(), fullName: z.string() }))
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
  profile: t.procedure.query(async () => {
    throw new Error('Not implemented');
  }),
});
