import { t } from '@/types/trpc/common';

// Definir el router de estado
export const statusRouter = t.router({
  ping: t.procedure.query(async () => {
    return { status: 'ok' };
  }),
});
