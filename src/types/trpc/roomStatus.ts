import { t } from '@/types/trpc/common';

// Definir el router de estados de habitaciones
export const roomStatusRouter = t.router({
  getAll: t.procedure.query(async () => {
    throw new Error('Not implemented');
  }),
});
