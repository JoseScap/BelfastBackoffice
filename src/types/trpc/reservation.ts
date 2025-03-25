import { t } from '@/types/trpc/common';
import {
  createReservationRequestSchema,
  createReservationResponseSchema,
  listReservationsRequestSchema,
  listReservationsByStatusResponseSchema,
  reservationStatusResponseSchema,
  confirmReservationRequestSchema,
  confirmReservationResponseSchema,
  cancelReservationRequestSchema,
  cancelReservationResponseSchema,
  editReservationRequestSchema,
  editReservationResponseSchema,
} from '@/types/api/reservation';

// Definir el router de reservaciones
export const reservationRouter = t.router({
  create: t.procedure
    .input(createReservationRequestSchema)
    .output(createReservationResponseSchema)
    .mutation(async () => {
      throw new Error('Not implemented');
    }),

  list: t.procedure
    .input(listReservationsRequestSchema)
    .output(listReservationsByStatusResponseSchema.array())
    .query(async () => {
      throw new Error('Not implemented');
    }),

  getAllStatuses: t.procedure.output(reservationStatusResponseSchema.array()).query(async () => {
    throw new Error('Not implemented');
  }),

  confirm: t.procedure
    .input(confirmReservationRequestSchema)
    .output(confirmReservationResponseSchema)
    .mutation(async () => {
      throw new Error('Not implemented');
    }),

  cancel: t.procedure
    .input(cancelReservationRequestSchema)
    .output(cancelReservationResponseSchema)
    .mutation(async () => {
      throw new Error('Not implemented');
    }),

  edit: t.procedure
    .input(editReservationRequestSchema)
    .output(editReservationResponseSchema)
    .mutation(async () => {
      throw new Error('Not implemented');
    }),
});
